# About
This repository is for a Vercel hosted SvelteKit website. The premise of the website is to allow users to draw 15 different Chinese numerals, and a pretrained convolutional neural network will make predictions upon which of the 15 Chinese numerals it is. This repository has two main directories: model and website, as the convolutional neural network was trained using Tensorflow in a Google Colab notebook, then imported into the SvelteKit website.

1. Model contains chinese_mnist.ipynb, which is the Google Colab notebook upon which the Neural Network was created and trained upon. The data directory contains the 15,000 images from the Kaggle Dataset, and the saved_models directory contains saved checkpoints for the model. Here is a link to the [dataset](https://www.kaggle.com/datasets/gpreda/chinese-mnist).

2. Website contains the SvelteKit directory necessary to host and run the website. To use it, simply change your directory to website/ with `cd website`, run `pnpm install` (or similar commands that achieve the same purpose), and then `pnpm run dev`.

## Model Training
This model was trained on a kaggle Chinese MNIST Dataset, linked [here](https://www.kaggle.com/datasets/gpreda/chinese-mnist). The training data consisted of the 15,000 64x64 images from the online dataset, as well as 15,000 augmented images of the dataset, for the model to be trained upon. Random image augmentations included Rotation, Zoom, and Translation.   

<img width="550" alt="cmnist_data" src="https://github.com/Li-Kane/cmnist-website/assets/122249106/bee6793e-84f4-4079-90eb-ce55f6d1c9c8">  

_Sample of 25 images from the dataset_

## Model Summary
Ultimately, the model was able to obtain 97.8% accuracy on the test set, with 99% accuracy on the training data. While the accuracy could be improved and previous models were able to obtain up to 99% accuracy on the test set, it was found that the 97.8% model was the more reliable on user-drawn input due to less overfitting. The model consists of ten layers, as summarized here:

```
Model: "sequential_2"
_________________________________________________________________
 Layer (type)                Output Shape              Param #   
=================================================================
 conv2d (Conv2D)             (None, 62, 62, 48)        1344      
                                                                 
 batch_normalization (Batch  (None, 62, 62, 48)        192       
 Normalization)                                                  
                                                                 
 conv2d_1 (Conv2D)           (None, 60, 60, 64)        27712     
                                                                 
 max_pooling2d (MaxPooling2  (None, 30, 30, 64)        0         
 D)                                                              
                                                                 
 batch_normalization_1 (Bat  (None, 30, 30, 64)        256       
 chNormalization)                                                
                                                                 
 conv2d_2 (Conv2D)           (None, 28, 28, 64)        36928     
                                                                 
 batch_normalization_2 (Bat  (None, 28, 28, 64)        256       
 chNormalization)                                                
                                                                 
 conv2d_3 (Conv2D)           (None, 26, 26, 80)        46160     
                                                                 
 max_pooling2d_1 (MaxPoolin  (None, 13, 13, 80)        0         
 g2D)                                                            
                                                                 
 batch_normalization_3 (Bat  (None, 13, 13, 80)        320       
 chNormalization)                                                
                                                                 
 conv2d_4 (Conv2D)           (None, 11, 11, 100)       72100     
                                                                 
 batch_normalization_4 (Bat  (None, 11, 11, 100)       400       
 chNormalization)                                                
                                                                 
 conv2d_5 (Conv2D)           (None, 9, 9, 100)         90100     
                                                                 
 max_pooling2d_2 (MaxPoolin  (None, 4, 4, 100)         0         
 g2D)                                                            
                                                                 
 batch_normalization_5 (Bat  (None, 4, 4, 100)         400       
 chNormalization)                                                
                                                                 
 flatten (Flatten)           (None, 1600)              0         
                                                                 
 dense (Dense)               (None, 256)               409856    
                                                                 
 dropout (Dropout)           (None, 256)               0         
                                                                 
 dense_1 (Dense)             (None, 256)               65792     
                                                                 
 dropout_1 (Dropout)         (None, 256)               0         
                                                                 
 dense_2 (Dense)             (None, 15)                3855      
                                                                 
=================================================================
Total params: 755671 (2.88 MB)
Trainable params: 754759 (2.88 MB)
Non-trainable params: 912 (3.56 KB)
_________________________________________________________________
```

## Other Key Points
- Inside of `website/static/model` is the imported Convolutional Neural Network, where `model.json` describes the model and `group1-shard1of1.bin` is a binary file containing the weights of the model.
- On the website, the model will error if there is regularization. Therefore, a workaround for me was to utilize the weights from a regularized model's `group1-shardof1.bin`, while using the `model.json` from a model of the same architecture without regularization
- The Google Colab chinese_mnist.ipynb is intended to be run on Google Drive.
- The dataset is not on github, so if you want to train the model you need to download it and move it into the `models/data` path!
- The website will work without having to train the model, as the model has already been pretrained.
- I built this as a personal project to introduce myself to Machine Learning and applying it to Web Development. It's very fun :).

## License
Copyright © 2023, Kane Li. Released under the MIT License.
