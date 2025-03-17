/**
 * Tests for position utility functions
 */
import {
  gridToPixel,
  pixelToGrid,
  getElementPixelPosition,
  getElementPixelDimensions,
  updateElementPosition
} from '../positionUtils';

describe('positionUtils', () => {
  const gridSize = 30;

  describe('gridToPixel', () => {
    it('should convert grid coordinates to pixels', () => {
      expect(gridToPixel({ x: 3, y: 4 }, gridSize)).toEqual({ x: 90, y: 120 });
    });

    it('should handle null or undefined input', () => {
      expect(gridToPixel(null, gridSize)).toEqual({ x: 0, y: 0 });
      expect(gridToPixel(undefined, gridSize)).toEqual({ x: 0, y: 0 });
    });
  });

  describe('pixelToGrid', () => {
    it('should convert pixel coordinates to grid', () => {
      expect(pixelToGrid({ x: 91, y: 119 }, gridSize)).toEqual({ x: 3, y: 4 });
    });

    it('should handle null or undefined input', () => {
      expect(pixelToGrid(null, gridSize)).toEqual({ x: 0, y: 0 });
      expect(pixelToGrid(undefined, gridSize)).toEqual({ x: 0, y: 0 });
    });
  });

  describe('getElementPixelPosition', () => {
    it('should handle element with position object', () => {
      const element = { position: { x: 3, y: 4 } };
      expect(getElementPixelPosition(element, gridSize)).toEqual({ x: 90, y: 120 });
    });

    it('should handle element with direct x/y properties', () => {
      const element = { x: 3, y: 4 };
      expect(getElementPixelPosition(element, gridSize)).toEqual({ x: 90, y: 120 });
    });

    it('should handle null or undefined input', () => {
      expect(getElementPixelPosition(null, gridSize)).toEqual({ x: 0, y: 0 });
      expect(getElementPixelPosition(undefined, gridSize)).toEqual({ x: 0, y: 0 });
    });
  });

  describe('getElementPixelDimensions', () => {
    it('should handle element with dimensions object', () => {
      const element = { dimensions: { width: 3, height: 4 } };
      expect(getElementPixelDimensions(element, gridSize)).toEqual({ width: 90, height: 120 });
    });

    it('should handle element with direct width/height properties', () => {
      const element = { width: 3, height: 4 };
      expect(getElementPixelDimensions(element, gridSize)).toEqual({ width: 90, height: 120 });
    });

    it('should handle null or undefined input', () => {
      expect(getElementPixelDimensions(null, gridSize)).toEqual({ width: gridSize, height: gridSize });
      expect(getElementPixelDimensions(undefined, gridSize)).toEqual({ width: gridSize, height: gridSize });
    });
  });

  describe('updateElementPosition', () => {
    it('should update element with position object', () => {
      const element = { id: '1', position: { x: 3, y: 4 } };
      const newPosition = { x: 5, y: 6 };
      expect(updateElementPosition(element, newPosition)).toEqual({
        id: '1',
        position: { x: 5, y: 6 }
      });
    });

    it('should update element with direct x/y properties', () => {
      const element = { id: '1', x: 3, y: 4 };
      const newPosition = { x: 5, y: 6 };
      expect(updateElementPosition(element, newPosition)).toEqual({
        id: '1',
        x: 5,
        y: 6
      });
    });

    it('should handle null or undefined input', () => {
      expect(updateElementPosition(null, { x: 5, y: 6 })).toBeNull();
      expect(updateElementPosition({ id: '1' }, null)).toEqual({ id: '1' });
    });
  });
});