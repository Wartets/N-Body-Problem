# N-Body Simulation

## Introduction

This project simulates the motion of multiple bodies (N-bodies) under the influence of gravitational forces, electromagnetic forces, fluid friction, and collision physics. It is implemented as an HTML5 web application, using CSS for styling and JavaScript for the simulation logic.

## Main Features

- **Dynamic Object Addition**: You can add an unlimited number of objects, constrained only by your computer's processing power.
- **Field visualization**: You can observe the force fields applied to the simulation, changing according to the objects.
- **Potential visualization**: You can observe the potential live from the simulation using isopleths.
- **Potential wells**: place in the simulation where the potential associated with a force field has a significant minimum, forcing objects to ‘fall back’ towards the wells.
- **Linking objects**: Use the Context Menu (right-click menu) to link two objects with a spring.
- **Analysis window**: select two objects from the simulation and compare their parameters. An accompanying graph shows the evolution of different parameters for each object throughout the simulation.
- **Multi-language Support**: Available in English, French, Spanish, and German, Italian, Latin (also some amusing translations) with additional languages planned for future releases.
- **Special Thanks**: Appreciation to Arthur Loubeau for contributing the Spanish translation and to Christian Abou for the Italian translation.

## Usage

For more information on how to access and use the simulation, please visit the [wiki](https://github.com/Wartets/N-Body-Problem/wiki#n-body-simulation-wiki "Wiki").

## Example

Here’s some examples of the simulation in action: 

images from v1.1.2:

![exemple1](https://github.com/user-attachments/assets/38d73689-0c6e-4a35-b179-b8fc7167450f "Random object preset with a grid")
![exemple2](https://github.com/user-attachments/assets/38148f72-d339-4707-8f96-4de98b7edf0d "Body line with electomagnetic field")
![exemple3](https://github.com/user-attachments/assets/27f9cce2-276e-43c7-ad93-7df6f2709d25 "Rosace with analysis interface")

images from v1.4.0:

![context-menu](https://github.com/user-attachments/assets/383838ac-9b3c-4b43-b655-db90c8e410fc "Right-click to open context menu")
![potentialwell-2](https://github.com/user-attachments/assets/b77f5a45-101e-4265-851f-4df16ece86f1 "Simulation with two potential wells and two objects on a semi-stable trajectory where the track has been left for a long time.")
![quadri-system-lightmode](https://github.com/user-attachments/assets/5669bc41-0525-4e8d-a7bf-04b2502a6568 "Four-body orbiting system with light mode")
![string](https://github.com/user-attachments/assets/672f215e-9c84-4dde-9232-77993bdc5bf2 "Basic preset but with two objects linked by a spring")
![potentialwell-isopleth](https://github.com/user-attachments/assets/6e9c0516-30bf-4db9-a2e2-b54d6a755a36 "Well of potential, full of objects and the isopleth activated")
![hydrogen-like-field](https://github.com/user-attachments/assets/83a79ac4-cd53-41d1-9af5-08780f3ce421 "High-precision electromagnetic force field on a preset of hydrogen-like objects")
![object-cluster](https://github.com/user-attachments/assets/65eb6598-b02e-43c9-8e60-63bdcfe67833 "Object cluster created from a random preset, by activating collisions and resetting velocities at the start of simulation.")


## Compatibility

The simulation has been tested on:
- **Firefox**: Version 130.0.1 (64-bit) (very good)
- **Chromium**: Version 122.0.6250.0 (Dev Build, 64-bit) (very good)
- **Safari**: iOS 16.4.1 (20E252) (okay)
- **Firefox Beta**: Version 131.0 45403 (Dev Build on iOS 16.4.1) (well)
- **TOR Browser**: Version 3.5.1 (iOS 16.4.1) (bad)
- **Zoomable**: Version 3.0 Pro (iOS 16.4.1) (very good)
- **Opera**: Version 84.1.4452.81169 (64-bit) (very good)
- **Opera GX**: Version 113.0.5230.135 (64-bit) (very good)

## Changelog

For detailed updates and improvements, please refer to the [Full Changelog](https://github.com/Wartets/N-Body-Problem/blob/main/Changelog.md "Full Changelog").
