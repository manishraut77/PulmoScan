import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
import os

# Device selection for Mac (MPS = Apple GPU)
if torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

# Rebuild the exact model architecture
model = models.resnet18(weights=None)  # No need to download again
model.fc = nn.Linear(512, 2)  # 512 is resnet18 backbone output size
model = model.to(device)

# Load saved weights
checkpoint = torch.load("models/resnet18_tb.pt", map_location=device)
model.load_state_dict(checkpoint["model_state"])

# Transform for test images (must match training pipeline!)
test_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Load test dataset and DataLoader
test_dataset = datasets.ImageFolder("data/test", transform=test_transform)
test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

# Loss function for evaluation
criterion = nn.CrossEntropyLoss()

# Evaluate on test data
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

print("\nTest Results:")
print("Test loss:", test_loss)
print("Test acc:", test_acc)
