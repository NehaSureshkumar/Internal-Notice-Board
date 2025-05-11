// This is a diagnostic script to ensure the AppProvider is correctly instantiated
// and the useAppContext hook works correctly
import { useAppContext } from '../context/app-context';

export function ContextValidator() {
  try {
    const context = useAppContext();
    console.log('AppContext successfully loaded:', !!context);
    return null;
  } catch (error) {
    console.error('Error using AppContext:', error);
    return null;
  }
}