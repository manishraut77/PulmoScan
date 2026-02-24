#PulmoScan -- Tuberculosis Detection System

**Description:** A machine learning-powered application that analyzes chest X-ray images to identify signs of tuberculosis. The system combines a Python-based backend for model training and inference with a responsive React/Vite frontend for user interaction.

This repository contains a complete application for detecting tuberculosis (TB) from chest X-ray images. It consists of a Python-based backend for model training and inference, and a React/Vite-based frontend with a modern user interface.

---

## 🧠 Project Overview

The TBS project is designed to allow medical professionals or users to upload chest X-ray images and receive a prediction on whether TB is present. It includes:

- A **Python backend** that handles data preparation, model training using deep learning (ResNet18), and inference on new images.
- A **Frontend** built with **React** and **Vite** that provides authentication, image upload, diagnosis display, and user settings.
- Support for uploading results to a backend database via Supabase (configured in `frontend/src/services`).
- Pretrained model weights under `models/resnet18_tb.pt` for immediate use.

---

## 📁 Repository Structure

```
TBS/
├── ai/                        # Python backend code
│   ├── app.py                 # Flask or FastAPI app for inference (check details)
│   ├── train.py               # Script to train the TB detection model
│   ├── test.py                # Evaluation script for the trained model
│   └── requirements.txt       # Python dependencies
│
├── data/                      # Chest X-ray data organized by set
│   ├── train/                 # Training images (normal/ tb)
│   ├── val/                   # Validation images
│   └── test/                  # Test images
│
├── frontend/                  # React/Vite frontend application
│   ├── public/                # Static assets
│   ├── src/                   # React source code (components, pages, services)
│   ├── package.json           # Node dependencies and scripts
│   └── README.md              # (default Vite template README)
│
└── models/                    # Saved model weights
    └── resnet18_tb.pt         # Trained PyTorch model
```

> 📌 Note: The `ai` directory contains the core machine learning code, whereas `frontend` deals with user interaction.

---

## ⚙️ Setup Instructions

### Backend (Python)

1. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate   # macOS/Linux
   ```

2. **Install dependencies**:
   ```bash
   cd ai
   pip install -r requirements.txt
   ```

3. **Prepare the dataset**
   - Place your chest X-ray images under the `data/train`, `data/val`, and `data/test` directories. Subfolders `normal` and `tb` should contain corresponding images.
   - Ensure file naming conventions work with the data loader in `train.py`.

4. **Train the model** (optional if using pretrained weights):
   ```bash
   python train.py --epochs 20 --batch-size 32
   ```
   Adjust parameters as needed. Trained weights will be saved to `models/resnet18_tb.pt` by default.

5. **Evaluate the model**:
   ```bash
   python test.py --model-path ../models/resnet18_tb.pt
   ```

6. **Run the inference API**
   ```bash
   python app.py
   ```
   This will start a server that receives images and returns predictions. Check the script for port/config details.

### Frontend (React)

1. **Install Node.js** (v16+ recommended).

2. **Install dependencies and start development server**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Configuration**
   - Update `frontend/src/services/api.js` with the backend API URL.
   - Configure Supabase credentials in `frontend/src/services/supabaseClient.js` if using authentication or storing results.

4. **Build for production**:
   ```bash
   npm run build
   ```
   Output will be in `frontend/dist`. Serve using any static file server.

---

## 🚀 Using the Application

1. **Launch the backend** as described above.
2. **Launch the frontend** and open the app in a browser (usually at `http://localhost:5173`).
3. **Sign in / Register** using the authentication modal (if set up).
4. **Upload an X-ray image** on the diagnosis page to get a TB prediction.
5. **View past results** and manage settings through respective pages.

---

## 📊 Data Source & Splitting

The chest X-ray images used by this project are assumed to come from publicly available datasets such as the [NIH Chest X-ray dataset](https://nihcc.app.box.com/v/ChestXray-NIHCC) or [Kaggle TB dataset](https://www.kaggle.com/datasets). Images should be organized into `normal` and `tb` classes.

Data directories follow this structure:
```
data/
  train/
    normal/
    tb/
  val/
    normal/
    tb/
  test/
    normal/
    tb/
```
- **Training set**: used for fitting the model (typically ~70–80% of total images).
- **Validation set**: used for hyperparameter tuning and early stopping (~10–15%).
- **Test set**: reserved for final evaluation (~10–15%).

Make sure to maintain a balanced distribution of classes in each split to avoid bias.

## 🏋️ Training Approach

The backend leverages PyTorch and a ResNet18 architecture pretrained on ImageNet. Key steps in `train.py`:

1. **Data loading and augmentation** – images are resized and normalized; augmentations such as random horizontal flips and rotations can be applied to the training loader to improve generalization.
2. **Model initialization** – load a ResNet18, replace the final fully connected layer with a 2‑class output, and optionally unfreeze layers for fine-tuning.
3. **Training loop** – use cross-entropy loss and an optimizer such as Adam or SGD; monitor validation loss/accuracy for early stopping.
4. **Checkpointing** – save the best model weights to `models/resnet18_tb.pt` based on validation performance.

You can customize hyperparameters (learning rate, batch size, epochs) via command-line arguments supported in `train.py`.

## 🧩 Extending or Modifying the Project

- **Add new models**: Modify `train.py` to experiment with other architectures or hyperparameters.
- **Data augmentation**: Insert transforms in the dataset loader.
- **Frontend features**: Add new React components in `frontend/src/components` or pages under `frontend/src/pages`.
- **Backend API endpoints**: Expand `app.py` with additional routes for user management or analytics.

---

## ❓ Troubleshooting

- If the frontend cannot reach the backend, confirm the API URL and CORS settings in `app.py`.
- For dependency issues, verify Python and Node versions and reinstall using the steps above.
- Ensure the dataset directories contain the correct substructure (`normal` / `tb`) and supported image formats (jpg, png).

---

## 📄 License

This project is provided under [MIT License](LICENSE) (if applicable). Adjust as needed.

---

## 🙌 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. Please follow standard GitHub workflow and include tests when adding features.

---

## 🛠️ Acknowledgments

- Built using PyTorch for deep learning.
- Frontend bootstrapped with React and Vite.
- Inspired by medical imaging research.


---

*Happy diagnosing!* 🚑
