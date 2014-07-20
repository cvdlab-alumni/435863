Final Project for Computational Graphics course
==============


Salvati Danilo - 435863
------------------------------


# Link to the project #

[sadan91.github.io/final-project](http://sadan91.github.io/final-project)

---

# Work Description #

In index.html I defined the structure of the web page and imported all scripts needed for the work

This is the directory structure:


```
─── final-project
	├── images
	|	└── textures
	|		└── bathroom
	|		└── bedroom1
	|		└── bedroom2
	|		└── ground
	|		└── house
	|		└── kitchen
	|		└── livingroom
	|		└── skybox
	|		└── videos
    └── models
	|	└── bathroom
	|	└── bedroom1
	|	└── bedroom2
	|	└── kitchen
	|	└── livingroom
    └── scripts
	|	└── dependencies
	|	└── project_libs
	|		└── house
    └── sounds
    └── videos
```

* **Images** contains all textures used in the project.
* **Models** contains all obj models importes with mtl files.
* **Scripts** contains all imported scripts. In *dependencies* there are all the externals libraries and in *project_libs* all scripts written by me. 
* **Sounds** contains all sounds used in the project
* **Videos** contains all videos used in the project

This is the description for all scripts in project_libs:

* Inside house folder there are scripts that build all rooms and the building
* [gui](scripts/project_libs/gui.js): build dat.gui controls
* [index.js](scripts/project_libs/index.js): main script, calls other files and build entire project
* [motionDetection.js](scripts/project_libs/motionDetection.js): collects all functions needed for motion detection
* [objectLoader.js](scripts/project_libs/objectLoader.js): function that loads an obj model with mtl file
* [objectPicking.js](scripts/project_libs/objectPicking.js): functions for managing object picking
* [outdoor.js](scripts/project_libs/outdoor.js): creates neighborhood (skybox, sun...)
* [PLNavigation.js](scripts/project_libs/PLNavigation.js): manages pointer lock navigation
* [sounds.js](scripts/project_libs/sounds.js): creates sound for some objects
* [water.js](scripts/project_libs/water.js): creates water using an external library

---

# Features #

* **First person navigation** and **Trackball navigation**
* **Night/Day Cycle**
* **Collision detection** (in first person mode)
* **Video texture** with **Motion detection** for choosing videos
* **Normal and bump maps**
* **PC animation with real web page**
* **Mirror** with cubeCamera
* **Water texture** using an external shader
* **Object picking**
* **Tween animation**
* **Skybox**
* **Fog**
* **Sounds effects**
* **Gui** for controlling some parts of the project
* **Flare light** for the Sun