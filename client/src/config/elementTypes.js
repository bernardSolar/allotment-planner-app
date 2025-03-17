/**
 * Configuration for garden element types
 */

// Element categories for the palette
export const ELEMENT_CATEGORIES = {
  STRUCTURES: 'structures',
  PLANTS: 'plants',
  TREES: 'trees',
  DECORATIVE: 'decorative'
};

// Element types
export const ELEMENT_TYPES = {
  RAISED_BED: 'raisedBed',
  FLAT_BED: 'flatBed',
  PATH: 'path',
  PLANT: 'plant',
  TREE: 'tree',
  BUSH: 'bush',
  STRUCTURE: 'structure',
  BACKGROUND: 'background'
};

// Element definitions for each category
export const ELEMENT_DEFINITIONS = {
  // Structures category
  structures: [
    { 
      id: 'raisedBed', 
      name: 'Raised Bed', 
      type: ELEMENT_TYPES.RAISED_BED, 
      dimensions: { width: 3, height: 2 } 
    },
    { 
      id: 'flatBed', 
      name: 'Flat Bed', 
      type: ELEMENT_TYPES.FLAT_BED, 
      dimensions: { width: 4, height: 2 } 
    },
    { 
      id: 'path', 
      name: 'Path', 
      type: ELEMENT_TYPES.PATH, 
      dimensions: { width: 1, height: 3 } 
    },
    { 
      id: 'fence', 
      name: 'Fence', 
      type: 'fence', 
      dimensions: { width: 5, height: 1 } 
    },
    { 
      id: 'shed', 
      name: 'Shed', 
      type: 'shed', 
      dimensions: { width: 2, height: 2 } 
    }
  ],
  
  // Plants category
  plants: [
    { 
      id: 'tomato', 
      name: 'Tomato', 
      type: ELEMENT_TYPES.PLANT, 
      dimensions: { width: 1, height: 1 } 
    },
    { 
      id: 'carrot', 
      name: 'Carrot', 
      type: ELEMENT_TYPES.PLANT, 
      dimensions: { width: 1, height: 1 } 
    },
    { 
      id: 'lettuce', 
      name: 'Lettuce', 
      type: ELEMENT_TYPES.PLANT, 
      dimensions: { width: 1, height: 1 } 
    }
  ],
  
  // Trees category
  trees: [
    { 
      id: 'appleTree', 
      name: 'Apple Tree', 
      type: ELEMENT_TYPES.TREE, 
      dimensions: { width: 3, height: 3 } 
    },
    { 
      id: 'cherryTree', 
      name: 'Cherry Tree', 
      type: ELEMENT_TYPES.TREE, 
      dimensions: { width: 3, height: 3 } 
    },
    { 
      id: 'bush', 
      name: 'Bush', 
      type: ELEMENT_TYPES.BUSH, 
      dimensions: { width: 2, height: 2 } 
    }
  ],
  
  // Decorative category
  decorative: [
    { 
      id: 'bench', 
      name: 'Bench', 
      type: ELEMENT_TYPES.STRUCTURE, 
      dimensions: { width: 2, height: 1 } 
    },
    { 
      id: 'pond', 
      name: 'Pond', 
      type: ELEMENT_TYPES.STRUCTURE, 
      dimensions: { width: 3, height: 2 } 
    }
  ]
};