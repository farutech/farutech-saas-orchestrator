import { capitalize } from './capitalize';
import { truncate } from './truncate';
import { slugify } from './slugify';
import { camelCase, pascalCase, kebabCase, snakeCase } from './case';

describe('String Utils', () => {
  describe('capitalize', () => {
    test('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
      expect(capitalize('hELLO')).toBe('Hello');
    });

    test('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    test('handles single character', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('A')).toBe('A');
    });
  });

  describe('truncate', () => {
    test('truncates long strings', () => {
      expect(truncate('Hello World', 5)).toBe('He...');
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    test('does not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    test('handles custom suffix', () => {
      expect(truncate('Hello World', 5, '***')).toBe('He***');
    });

    test('handles empty string', () => {
      expect(truncate('', 5)).toBe('');
    });
  });

  describe('slugify', () => {
    test('converts to lowercase', () => {
      expect(slugify('HELLO WORLD')).toBe('hello-world');
    });

    test('removes special characters', () => {
      expect(slugify('Hello! @World#')).toBe('hello-world');
    });

    test('replaces spaces with hyphens', () => {
      expect(slugify('hello world')).toBe('hello-world');
    });

    test('handles multiple spaces and hyphens', () => {
      expect(slugify('hello   world--test')).toBe('hello-world-test');
    });

    test('removes leading and trailing hyphens', () => {
      expect(slugify('-hello-world-')).toBe('hello-world');
    });
  });

  describe('case conversions', () => {
    describe('camelCase', () => {
      test('converts space separated', () => {
        expect(camelCase('hello world')).toBe('helloWorld');
      });

      test('converts kebab-case', () => {
        expect(camelCase('hello-world')).toBe('helloWorld');
      });

      test('converts snake_case', () => {
        expect(camelCase('hello_world')).toBe('helloWorld');
      });

      test('handles PascalCase', () => {
        expect(camelCase('HelloWorld')).toBe('helloWorld');
      });
    });

    describe('pascalCase', () => {
      test('converts space separated', () => {
        expect(pascalCase('hello world')).toBe('HelloWorld');
      });

      test('converts kebab-case', () => {
        expect(pascalCase('hello-world')).toBe('HelloWorld');
      });
    });

    describe('kebabCase', () => {
      test('converts camelCase', () => {
        expect(kebabCase('helloWorld')).toBe('hello-world');
      });

      test('converts PascalCase', () => {
        expect(kebabCase('HelloWorld')).toBe('hello-world');
      });

      test('converts space separated', () => {
        expect(kebabCase('hello world')).toBe('hello-world');
      });
    });

    describe('snakeCase', () => {
      test('converts camelCase', () => {
        expect(snakeCase('helloWorld')).toBe('hello_world');
      });

      test('converts PascalCase', () => {
        expect(snakeCase('HelloWorld')).toBe('hello_world');
      });

      test('converts space separated', () => {
        expect(snakeCase('hello world')).toBe('hello_world');
      });
    });
  });
});