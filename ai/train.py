import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models


# ---------- Device selection (CUDA > MPS > CPU) ----------
if torch.cuda.is_available():
    device = torch.device("cuda")
elif torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")


# ---------- Transforms ----------
# Basic but correct: pretrained ResNet expects 3-channel + ImageNet normalization.
imagenet_mean = [0.485, 0.456, 0.406]
imagenet_std  = [0.229, 0.224, 0.225]

train_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=imagenet_mean, std=imagenet_std),
])

# Keep eval the same for now (basic version).
eval_transform = train_transform


# ---------- Datasets + Loaders ----------
train_dataset = datasets.ImageFolder("data/train", transform=train_transform)
val_dataset   = datasets.ImageFolder("data/val",   transform=eval_transform)
test_dataset  = datasets.ImageFolder("data/test",  transform=eval_transform)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader   = DataLoader(val_dataset,   batch_size=32, shuffle=False)
test_loader  = DataLoader(test_dataset,  batch_size=32, shuffle=False)


# ---------- Model ----------
model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)

# Replace final layer (2 classes: normal vs tb)
model.fc = nn.Linear(model.fc.in_features, 2)

model = model.to(device)


def main():
    print("Device:", device)
    print("Classes:", train_dataset.classes)
    print("Train images:", len(train_dataset))
    print("Val images:", len(val_dataset))
    print("Test images:", len(test_dataset))

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4)

    epochs = 10
    best_val_acc = 0.0

    for epoch in range(1, epochs + 1):
        # -------- TRAIN --------
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:
            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)
            loss = criterion(outputs, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            preds = torch.argmax(outputs, dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_loss = running_loss / total
        train_acc = correct / total

        # -------- VAL --------
        model.eval()
        val_running_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images = images.to(device)
                labels = labels.to(device)

                outputs = model(images)
                loss = criterion(outputs, labels)

                val_running_loss += loss.item() * images.size(0)
                preds = torch.argmax(outputs, dim=1)
                val_correct += (preds == labels).sum().item()
                val_total += labels.size(0)

        val_loss = val_running_loss / val_total
        val_acc = val_correct / val_total

        print(f"\nEpoch {epoch}/{epochs}")
        print(f"  train loss: {train_loss:.4f}  train acc: {train_acc:.4f}")
        print(f"  val   loss: {val_loss:.4f}  val   acc: {val_acc:.4f}")

        # -------- SAVE BEST --------
        if val_acc > best_val_acc:
            best_val_acc = val_acc

            os.makedirs("models", exist_ok=True)
            ckpt = {
                "model_state": model.state_dict(),
                "class_to_idx": train_dataset.class_to_idx,
                "arch": "resnet18",
            }
            torch.save(ckpt, "models/resnet18_tb.pt")
            print(f"  ✅ Saved new best model (val acc = {best_val_acc:.4f}) to models/resnet18_tb.pt")

    # -------- TEST best checkpoint --------
    print("\nLoading best checkpoint and evaluating on TEST...")

    ckpt = torch.load("models/resnet18_tb.pt", map_location=device)
    model.load_state_dict(ckpt["model_state"])

    model.eval()
    test_running_loss = 0.0
    test_correct = 0
    test_total = 0

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)
            loss = criterion(outputs, labels)

            test_running_loss += loss.item() * images.size(0)
            preds = torch.argmax(outputs, dim=1)
            test_correct += (preds == labels).sum().item()
            test_total += labels.size(0)

    test_loss = test_running_loss / test_total
    test_acc = test_correct / test_total

    print("Test loss:", test_loss)
    print("Test acc:", test_acc)


if __name__ == "__main__":
    main()
