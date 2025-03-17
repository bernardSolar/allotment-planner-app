/**
 * Tests for collision utility functions
 */
import { rectIntersect, checkElementCollision } from '../collisionUtils';

describe('collisionUtils', () => {
  describe('rectIntersect', () => {
    it('should detect when rectangles overlap', () => {
      const rect1 = { x: 0, y: 0, width: 10, height: 10 };
      const rect2 = { x: 5, y: 5, width: 10, height: 10 };
      expect(rectIntersect(rect1, rect2)).toBe(true);
    });

    it('should detect when rectangles do not overlap', () => {
      const rect1 = { x: 0, y: 0, width: 10, height: 10 };
      const rect2 = { x: 20, y: 20, width: 10, height: 10 };
      expect(rectIntersect(rect1, rect2)).toBe(false);
    });

    it('should detect when rectangles touch edges', () => {
      const rect1 = { x: 0, y: 0, width: 10, height: 10 };
      const rect2 = { x: 10, y: 0, width: 10, height: 10 };
      expect(rectIntersect(rect1, rect2)).toBe(false);
    });
  });

  describe('checkElementCollision', () => {
    const gridSize = 30;
    const element = {
      id: '1',
      dimensions: { width: 2, height: 2 },
      position: { x: 3, y: 3 }
    };
    
    const otherElements = [
      {
        id: '2',
        dimensions: { width: 2, height: 2 },
        position: { x: 6, y: 6 }
      },
      {
        id: '3',
        dimensions: { width: 2, height: 2 },
        position: { x: 3, y: 6 }
      },
      {
        id: 'background',
        type: 'background',
        dimensions: { width: 50, height: 50 },
        position: { x: 0, y: 0 }
      }
    ];

    it('should detect collision with other elements', () => {
      const newPosition = { x: 150, y: 150 }; // Would collide with element id='2'
      expect(checkElementCollision(element, newPosition, otherElements, gridSize)).toBe(true);
    });

    it('should not detect collision when elements are apart', () => {
      const newPosition = { x: 240, y: 240 }; // Away from all other elements
      expect(checkElementCollision(element, newPosition, otherElements, gridSize)).toBe(false);
    });

    it('should ignore collision with self', () => {
      // Try to check collision with self
      expect(checkElementCollision(element, { x: 90, y: 90 }, [element, ...otherElements], gridSize)).toBe(false);
    });

    it('should ignore collision with background', () => {
      // Should not detect collision with background element
      expect(checkElementCollision(element, { x: 30, y: 30 }, otherElements, gridSize)).toBe(false);
    });
  });
});