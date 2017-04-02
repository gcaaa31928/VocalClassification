from __future__ import print_function

from time import sleep

import librosa
import numpy as np
import os
from keras.callbacks import TensorBoard
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Convolution2D, MaxPooling2D
import math
import keras

from vocal_classification.settings import AUDIO_DIR


class Predict:
    sample_size = 32000
    sample_rate = 16000
    n_mfcc = 80
    n_fft = 2048
    mfcc_hop_size = 512

    @staticmethod
    def process_data(audio_name):
        audio_file = os.path.join(AUDIO_DIR, audio_name)
        samples, _ = librosa.load(audio_file, sr=Predict.sample_rate)
        mfcc_chunks = []
        while len(samples) >= Predict.sample_size:
            sample_chunk = samples[:Predict.sample_size]
            mfcc_features = np.array(
                librosa.feature.mfcc(y=sample_chunk, sr=Predict.sample_rate, n_mfcc=Predict.n_mfcc,
                                     n_fft=Predict.n_fft, hop_length=Predict.mfcc_hop_size)
            )
            mfcc_chunks.append(mfcc_features)
            samples = samples[int(Predict.sample_size):]

        mfcc_chunks = np.array(mfcc_chunks)
        return mfcc_chunks

    @staticmethod
    def run(audio_name):
        nb_classes = 2
        n_mfcc = 80
        sample_size = 32000
        sample_rate = 16000
        mfcc_hop_size = 512
        mfcc_size = math.ceil(sample_size / float(sample_rate) * 31.4 * sample_rate / 16000 * 512 / mfcc_hop_size)
        input_shape = (n_mfcc, mfcc_size, 1)
        # number of convolutional filters to use
        nb_filters = 16
        # size of pooling area for max pooling
        pool_size = (3, 3)
        # convolution kernel size
        kernel_size = (3, 3)

        model = Sequential()
        model.add(Convolution2D(16, 3, 3,
                                border_mode='valid',
                                input_shape=input_shape))
        model.add(Activation('relu'))

        model.add(Convolution2D(16, 3, 3))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2, 2)))

        model.add(Convolution2D(16, 3, 3))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        print(model.output_shape)
        model.add(Dropout(0.5))
        model.add(Flatten())
        print(model.output_shape)
        # sleep(100)
        model.add(Dense(128))
        model.add(Activation('relu'))
        model.add(Dropout(0.5))
        model.add(Dense(nb_classes))
        print(model.count_params())
        model.add(Activation('softmax'))
        # print(model.count_params())
        model.compile(loss='categorical_crossentropy',
                      optimizer='adadelta',
                      metrics=['accuracy'])
        model.load_weights('./model-mcnn.h5')
        mfcc_chunks = Predict.process_data(audio_name)

        mfcc_chunks = np.reshape(mfcc_chunks, [-1, n_mfcc, mfcc_size, 1])
        if mfcc_chunks.shape[0] == 0:
            return
        predict = model.predict(mfcc_chunks, batch_size=mfcc_chunks.shape[0])
        return predict
        # non vocal
