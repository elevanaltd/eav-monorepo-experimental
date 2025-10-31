import { describe, it, expect } from 'vitest';
import * as exports from './index';

describe('UI Package Exports', () => {
  it('should export HierarchicalNavigationSidebar component', () => {
    expect(exports.HierarchicalNavigationSidebar).toBeDefined();
  });

  it('should re-export NavigationProvider from shared-lib', () => {
    expect(exports.NavigationProvider).toBeDefined();
  });

  it('should re-export useNavigation hook from shared-lib', () => {
    expect(exports.useNavigation).toBeDefined();
  });
});
