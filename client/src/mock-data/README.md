# Mock Data Files for Internal Knowledge Hub

This directory contains sample data files that can be used to populate the Internal Knowledge Hub application. These files provide realistic examples of notices, knowledge articles, and categories that can be displayed in the application.

## Available Files

1. `sample-notices.json` - Contains 10 sample company announcements with various priorities and dates
2. `sample-categories.json` - Contains 10 department categories for organizing knowledge articles
3. `sample-knowledge-items.json` - Contains 10 sample knowledge articles across different categories

## How to Use These Files

### Method 1: Import via the Application UI

1. Start the application using `npm run dev`
2. Open your browser to http://localhost:5000
3. Click the import icon (upload) in the top navigation bar
4. Click "Choose File" and select one of the JSON files from this directory
5. Select what to import (Notices, Knowledge Items, or Categories)
6. Choose "Replace existing data" if you want to start fresh
7. Click "Import" to load the data

### Method 2: Use for Initial Data Load

You can modify the application to use these files as the initial data when the database is empty:

1. Open `client/src/context/app-context.tsx`
2. Find the `resetToSampleData` function (around line 220)
3. Modify it to load data from these files:

```typescript
const resetToSampleData = async (): Promise<void> => {
  try {
    setIsLoading(true);
    
    // Clear existing data
    await db.notices.clear();
    await db.knowledgeItems.clear();
    await db.categories.clear();
    
    // Import sample data - Replace these with fetch calls to the JSON files
    const noticesResponse = await fetch('/mock-data/sample-notices.json');
    const sampleNotices = await noticesResponse.json();
    
    const categoriesResponse = await fetch('/mock-data/sample-categories.json');
    const sampleCategories = await categoriesResponse.json();
    
    const knowledgeItemsResponse = await fetch('/mock-data/sample-knowledge-items.json');
    const sampleKnowledgeItems = await knowledgeItemsResponse.json();
    
    // Add sample data to the database
    await db.categories.bulkAdd(sampleCategories);
    await db.notices.bulkAdd(sampleNotices);
    await db.knowledgeItems.bulkAdd(sampleKnowledgeItems);
    
    // Update state
    setCategories(sampleCategories);
    setNotices(sampleNotices);
    setKnowledgeItems(sampleKnowledgeItems);
    
    toast({
      title: 'Success',
      description: 'Data reset to sample content',
    });
  } catch (error) {
    console.error('Failed to reset data:', error);
    toast({
      title: 'Error',
      description: 'Failed to reset data',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};
```

### Method 3: Copy into Sample Data Functions

You can directly copy the data from these files into the sample data generator functions:

1. Open `client/src/context/app-context.tsx`
2. Find the functions `getSampleCategories`, `getSampleNotices`, and `getSampleKnowledgeItems`
3. Replace their contents with the data from the corresponding JSON files

## Customizing the Data

Feel free to modify these files to:

1. Add your own organization-specific content
2. Update dates to reflect current timeframes
3. Change category names or icons to match your organization's structure
4. Add more items to each file as needed

## File Format

All files use JSON format and follow the schema defined in the application. You can use these as templates for creating additional data.