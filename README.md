# About
This repository is for a Vercel hosted SvelteKit website. The premise of the website is to allow users to draw 15 different Chinese numerals, and a pretrained convolutional neural network will make predictions upon which of the 15 Chinese numerals it is. This repository has two main directories: Model and Website. Model stores the convolutional neural network that was trained, and it is imported into Website, a SvelteKit application which processes user-drawn input for the model to predict upon.

1. Model contains cmnist.ipynb, which is the Google Colab notebook upon which the Neural Network was created and trained upon, chinese_mnist.tfrecords, which contains the 15,000 images the model is trained on, and a cmnist and saved_models directory to ensure that cmnist.ipynb works.

2. Website contains the SvelteKit directory necessary to host and run the website. The imported model is stored in Website\cmnist-website\Website\static\model. To run the website, simply change directory into Website, install dependencies, and run. Here is an example: `cd website`, `pnpm install`, `pnpm run dev`. 

## Model Training
This model was trained on a kaggle Chinese MNIST Dataset, linked [here](https://www.kaggle.com/datasets/gpreda/chinese-mnist). The training data consisted of the 15,000 64x64 images from the online dataset, which was contrasted to better match the canvas input from the website. Random image augmentations were part of the training layer and included Rotation, Zoom, and Translation. Keras_tuner was used to find the hyperparameters.

<img width="550" alt="cmnist_data" src="https://github.com/Li-Kane/cmnist-website/assets/122249106/bee6793e-84f4-4079-90eb-ce55f6d1c9c8">  

_Sample of 25 images from the dataset_

## Model Summary
Ultimately, the model was able to obtain 99.47% accuracy on the test set. When imported on the website, the model appears to generally be able to predict well, though it does tend to struggle more on distinguishing between 二 and 三 as well as between 万 and 亿。In total, it has 5 convolutional layers and 3 dense. Below is a summary:

```
Model: "sequential_1"
_________________________________________________________________
 Layer (type)                Output Shape              Param #   
=================================================================
 random_rotation_1 (RandomR  (None, 64, 64, 3)         0         
 otation)                                                        
                                                                 
 random_zoom_1 (RandomZoom)  (None, 64, 64, 3)         0         
                                                                 
 random_translation_1 (Rand  (None, 64, 64, 3)         0         
 omTranslation)                                                  
                                                                 
 lambda_1 (Lambda)           (None, 64, 64, 3)         0         
                                                                 
 conv2d (Conv2D)             (None, 62, 62, 48)        1344      
                                                                 
 batch_normalization (Batch  (None, 62, 62, 48)        192       
 Normalization)                                                  
                                                                 
 conv2d_1 (Conv2D)           (None, 60, 60, 48)        20784     
                                                                 
 batch_normalization_1 (Bat  (None, 60, 60, 48)        192       
 chNormalization)                                                
                                                                 
 max_pooling2d (MaxPooling2  (None, 30, 30, 48)        0         
 D)                                                              
                                                                 
 conv2d_2 (Conv2D)           (None, 28, 28, 64)        27712     
                                                                 
 batch_normalization_2 (Bat  (None, 28, 28, 64)        256       
 chNormalization)                                                
                                                                 
 conv2d_3 (Conv2D)           (None, 26, 26, 64)        36928     
                                                                 
 batch_normalization_3 (Bat  (None, 26, 26, 64)        256       
 chNormalization)                                                
                                                                 
 max_pooling2d_1 (MaxPoolin  (None, 13, 13, 64)        0         
 g2D)                                                            
                                                                 
 conv2d_4 (Conv2D)           (None, 11, 11, 80)        46160     
                                                                 
 batch_normalization_4 (Bat  (None, 11, 11, 80)        320       
 chNormalization)                                                
                                                                 
 max_pooling2d_2 (MaxPoolin  (None, 5, 5, 80)          0         
 g2D)                                                            
                                                                 
 flatten (Flatten)           (None, 2000)              0         
                                                                 
 dense (Dense)               (None, 256)               512256    
                                                                 
 batch_normalization_5 (Bat  (None, 256)               1024      
 chNormalization)                                                
                                                                 
 dropout (Dropout)           (None, 256)               0         
                                                                 
 dense_1 (Dense)             (None, 256)               65792     
                                                                 
 batch_normalization_6 (Bat  (None, 256)               1024      
 chNormalization)                                                
                                                                 
 dropout_1 (Dropout)         (None, 256)               0         
                                                                 
 dense_2 (Dense)             (None, 15)                3855      
                                                                 
=================================================================
Total params: 718095 (2.74 MB)
Trainable params: 716463 (2.73 MB)
Non-trainable params: 1632 (6.38 KB)
_________________________________________________________________
```

## Other Key Points
- Inside of `website/static/model` is the imported Convolutional Neural Network, where `model.json` describes the model and `group1-shard1of1.bin` is a binary file containing the weights of the model.
- On the website, the model will error if there is regularization. Therefore, a workaround for me was to utilize the weights from a regularized model's `group1-shardof1.bin`, while using the `model.json` from a model of the same architecture without regularization
- cmnist.ipynb is intended to be run on Google Drive.
- I built this as a personal project to introduce myself to Machine Learning and applying it to Web Development. It's very fun :).

## License
Copyright © 2023, Kane Li. Released under the MIT License.
