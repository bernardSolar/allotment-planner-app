# Garden Planner Component Integration Guide

This document provides instructions for integrating the interactive garden planner components into the Allotment Planner application.

## Files Created

1. `GardenCanvas.js` - The interactive SVG canvas for garden layout design
2. `ElementPalette.js` - The palette of garden elements that can be added to the canvas
3. `gardenSlice.js` - Enhanced Redux slice for garden state management
4. `GardenPlannerPage.js` - Updated garden planner page with integrated components

## Integration Steps

### 1. Update the Redux Store

Replace the existing `gardenSlice.js` file in `client/src/slices/` with the new version provided.

### 2. Add Garden Components

Copy the `GardenCanvas.js` and `ElementPalette.js` files to `client/src/components/garden/`.

### 3. Update Garden Planner Page

Replace the existing `GardenPlannerPage.js` file in `client/src/pages/` with the new version provided.

## Component Overview

### GardenCanvas

The `GardenCanvas` component provides:

- SVG-based interactive canvas with drag-and-drop functionality
- Ability to pan and zoom the garden layout
- Support for different types of garden elements (raised beds, flat beds, plants, trees, etc.)
- Selection and manipulation of elements
- Visual feedback for selected elements

### ElementPalette

The `ElementPalette` component provides:

- Categorized selection of garden elements
- Visual representation of each element
- Selection mechanism that integrates with the Redux store
- Responsive grid layout for easy selection

### Garden Planner Page

The updated `GardenPlannerPage` integrates these components and adds:

- Garden selection and management
- Create, update, and delete functionality for gardens
- Container layout for the garden planner UI

## Customization

### Adding New Element Types

To add new garden element types:

1. Add the element to the `elements` object in `ElementPalette.js` under the appropriate category
2. Add a rendering function for the new element type in the `renderElement` function in `GardenCanvas.js`

### Styling

The components use styled-components for styling and can be customized by modifying the styled components at the top of each file.

## Example Usage

```jsx
import GardenCanvas from '../components/garden/GardenCanvas';
import ElementPalette from '../components/garden/ElementPalette';

// Inside your component
return (
  <div>
    <ElementPalette />
    <GardenCanvas garden={gardenData} />
  </div>
);
```

## Future Enhancements

Planned enhancements for the garden planner include:

1. Element resizing functionality
2. Rotation of elements
3. Grid snapping for precise placement
4. Layer management for complex gardens
5. Group/ungroup elements
6. Undo/redo functionality
7. Export garden plan as image
8. Weather integration showing sun/shade patterns based on time of day/year
9. Plant spacing guides and companion planting indicators
10. Season visualization to show garden appearance in different months