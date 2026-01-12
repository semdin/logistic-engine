cmake_minimum_required(VERSION 3.10)
project(logistic_addon)

# N-API Ayarları
add_definitions(-DNAPI_DISABLE_CPP_EXCEPTIONS)
add_definitions(-DNODE_GYP_MODULE_NAME=${PROJECT_NAME}) # <-- BU SATIR EKLENDİ

# Header Dosyaları
include_directories(${CMAKE_JS_INC})
include_directories(${CMAKE_SOURCE_DIR}/node_modules/node-addon-api)

# Kaynak Kod
add_library(${PROJECT_NAME} SHARED cpp/main.cpp)

# Çıktı Ayarları (.node uzantısı)
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# Mac için özel ayar (Linux'ta zararı yok ama if bloğu iyidir)
if(APPLE)
    set_target_properties(${PROJECT_NAME} PROPERTIES LINK_FLAGS "-undefined dynamic_lookup")
endif()