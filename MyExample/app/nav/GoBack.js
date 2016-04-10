'use strict';

export function GoBack(navigator) {
  if (navigator && navigator.getCurrentRoutes().length > 1) {
		navigator.pop();
		return true;
  }
  return false;
}