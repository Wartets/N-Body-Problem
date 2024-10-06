# Changelog

## v1.0 - 31/08/2024

### Added

- View: object tracking, automatic/manual zoom, velocity vector, tracking selection, object trail
- Possibility of loading/saving/loading presets with any desired name
- Possibility of simulating as many objects as you like, changing their name and color, deleting or hiding them
- Buttons: Full-screen, Start/pause, Reset View, Zoom settings
- Simulation of displacement, gravity, collisions, and friction
- Controls: dt, mass, velocity (in x and y), position (in x and y), gravity, friction, collision
- UI: mouse coordinates and elapsed time
- Collision sound support ([impact-sound.mp3](https://github.com/Wartets/N-Body-Problem/blob/main/sound/impact-sound.mp3))
- v1.0 English translation
- v1.0 French translation
- v1.0 German translation
- v1.0 Spanish translation (thanks to Arthur Loubeau)
- Key usage support : gravity ("g"), collisions ("c"), reset view ("r"), friction ("f"), show speed vectors ("v"), play/pause ("space bar" or "enter"), Full-screen ("F11")/

## v1.0.1 - 01/09/2024

### Added

- Moving around object with mouse
- Key usage support : zoom ("scroll down" and "scroll up")

### Changed

- Paving the way for future ui changes, especially for controls
- Fixed minor clarity problems

## v1.1.0 - 01/09/2024

### Added

- Electromagnetic force support for each object.
- Option to set load parameters for each object, negative, neutral, or positive
- Electromagnetic force can be activated or deactivated

### Changed

- Updated translations to add electromagnetic parameters :
  - v1.1 English translation
  - v1.1 French translation
  - v1.1 German translation
  - v1.1 Spanish translation (thanks to Arthur Loubeau)
 
## v1.1.1 - 02/09/2024

### Added

- Gravitational field display added, supports adaptive view setting
- Added the ability to view the electromagnetic field, supports adaptive view setting
- v1.0 Italian translation (thanks to Christian Abou)
- v1.0 Latin translation

### Changed

- Minor bugs fixed in electrical charge parameters
- Correction of object location accuracy on canvas and in parameters
- Updated translations to add field parameters :
  - v1.2 English translation
  - v1.2 French translation
  - v1.2 German translation
  - v1.2 Spanish translation (thanks to Arthur Loubeau)

## v1.1.2 - 07/09/2024

### Added

- New help tab, where you'll find all the useful links related to the site
- It's now possible to zoom with two fingers using a pinch on mobile (doesn't work on all browsers)
- It is possible to choose to simulate with normalized constants or their actual values
- New translation :
  - v1.0 Ancien Français
  - v1.0 Pirate Français
  - v1.0 Shakespeare English
  - v1.0 Minion English

### Changed

- Fixed issue #3 
- Major reorganization of the script for improved readability and practicality
- Updated translations to add field parameters :
  - v1.3 English translation
  - v1.3 French translation
  - v1.3 German translation
  - v1.3 Spanish translation (thanks to Arthur Loubeau)
  - v1.1 Italian translation (thanks to Christian Abou)
  - v1.1 Latin translation

## v1.2.0 - 19/09/2024

### Added

- Added a more comprehensive information-menu for analysis and comparison on two simulation objects: #18 #19 
- Advanced settings category added:
  - Added developer mode for console information
  - Added controls for modifying the size of gravitational and electromagnetic field vectors
  - Constants can now be modified
- Auto zoom can now be enabled or disabled
- Sound can be activated or deactivated
- Several barycenters are available to center the view (geometric, mass, charge, and surface)
- Everything that can be done on a computer can now be done on a touch phone
- Added a mode to merge objects when they touch each other, if the mode is enabled
- Adding a merging sound
- It is possible to view the canvas grid and the X and Y axes
- Added metadata to the page
- Added information on fps and calculation saturation
- Added new presets

### Changed

- UI changes, settings categorized
- Big clean-up and code reorganization
- Fixed issue #23 
- Updated translations to add field parameters :
  - v1.4 English translation
  - v1.4 French translation
  - v1.4 German translation
  - v1.4 Spanish translation
  - v1.2 Italian translation
- Correction of friction calculation, to be able to play with lower values
- It is now impossible to input values without physical meaning (mass and radius strictly positive)
- The buttons on the canvas have been replaced by images

## v1.3.0 - 26/09/2024

### Added

- It is now possible to export a file containing the saved preset
- Potential wells added, objects always return to the wells:
  - Two presets containing wells have been added
  - Wells are categorized in the same way as objects, they can be moved by touch or mouse, they can be renamed, their colour changed, their parameters changed and so on.
- Improved the way trails are managed
- Reduced camera movements when moving an object with the mouse
- infoWindow chart now only initializes if infoWindow is opened for the first time
- Added functions to calculate additional information for the infoWindow menu; mainly focused on orbital parameters
- Addition of console returns
- Addition of a relativistic physic's mode (in beta for the moment, can be activated from the advanced settings menu)
- Speed of light ($c$), Archimedes' constant ($\pi$) and vacuum permittivity ($\epsilon_0$) added as modifiable constants
- Added the ability to manage field vector spacing

### Changed

- Fixed a shortcut key bug: pressing the space key will no longer click on the last button selected
- Categorizing objects
- Changed the way sound is handled on impact, issue https://github.com/Wartets/N-Body-Problem/issues/21
- From now on, when a word is not translated, the term ‘Not yet translated’ will be used instead
- English is now the default language on the website (unless there is a major translation problem, in which case it will revert to French)
- Updated translations :
  - v1.5 English translation
  - v1.5 French translation
  - v1.5 German translation
  - v1.5 Spanish translation
  - v1.3 Italian translation

### Removed

- Removed the simulate() function, which was never used for anything other than adding lag
- Removal of the Coulomb constant ($K$), which was no longer useful as it was expressed with other constants defined in the simulation.
- Removal of collision test and electromagnetic force presets

## v1.4.0 - 06/10/2024

### Added

- It's now possible to connect two objects with a string, which prevents them from being more than a given distance apart
- When you right-click on an object or well, a menu appears offering various actions:
  - Show/Hide object/well
  - Center view on object/well
  - Duplicate the object/well, with the clone next to it
  - Reset Velocity of object or all objects
  - Delete object/well
  - Delete all wells and objects
  - Select objects A and B to connect them with a spring
  - Unlink objects A and B
- Constants may or may not normalize, depending on the presets and force options selected
- It is now possible to use a negative 'dt' without any problem for the simulation
- The actual elapsed time is now displayed
- New objects didn't have names before, now they do
- Added restrictions to avoid bugs in the choice of 'focusObject'
- The default context menu can no longer be opened
- Added a clear mode to the site
- Added info texts for 'scrollzoom' and 'scale'
- It is now possible to display the isopleth of the simulation potential, and the display accuracy can be controlled in the advanced settings
- Added the possibility of displaying the old potential isopleth (this version represents the isopleth not with continuous curves but with crosses)
- Automatic zoom correction
- Time Out for mouse display on canvas

### Changed

- Left-clicking used to pause the simulation, this is no longer the case
- The wells are now located below the objects on the canvas
- Images/buttons have been changed to add clarity of use
- The colours of the images/buttons have been adjusted to maintain a stylistic line
- Skipped frames are now indicated by ping in ms
- 'Usage' text reduced to 'Use'
- Coordinates are now given in scientific format
- Friction no longer calculated, now it is again
- Script and file reorganization
- Better chart reset button in infoWindow
- 'displayFPS' becomes 'displayText'
- Updated translations :
  - v1.6 English translation
  - v1.6 French translation
  - v1.6 German translation
  - v1.6 Spanish translation
  - v1.4 Italian translation

### Removed

- Points were calculated and plotted for nothing, they have been removed
- Removal of unnecessary alpha-related lines when tracing Wells
