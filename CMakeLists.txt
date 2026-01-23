cmake_minimum_required(VERSION 3.18)
project(logistic_addon)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)  # Clangd için

# OR-Tools path - append to CMAKE_PREFIX_PATH for find_package
set(ORTOOLS_ROOT "$ENV{HOME}/libs/or-tools_x86_64_Ubuntu-24.04_cpp_v9.15.6755")
list(APPEND CMAKE_PREFIX_PATH "${ORTOOLS_ROOT}")

# Find OR-Tools (this handles protobuf, abseil, and all dependencies)
find_package(ortools REQUIRED)

# N-API Settings
add_definitions(-DNAPI_DISABLE_CPP_EXCEPTIONS)
add_definitions(-DNODE_GYP_MODULE_NAME=${PROJECT_NAME})

# Header Files
include_directories(${CMAKE_JS_INC})
include_directories(${CMAKE_SOURCE_DIR}/node_modules/node-addon-api)

# Source codes
add_library(${PROJECT_NAME} SHARED 
    cpp/main.cpp
    cpp/distance_calculator.cpp
    cpp/vrp_solver.cpp
)

# Link against OR-Tools (provides all includes, definitions, and transitive dependencies)
target_link_libraries(${PROJECT_NAME} ortools::ortools)

# Output settings (.node extension)
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# for mac
if(APPLE)
    set_target_properties(${PROJECT_NAME} PROPERTIES LINK_FLAGS "-undefined dynamic_lookup")
endif()