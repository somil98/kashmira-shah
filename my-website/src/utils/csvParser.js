/**
 * CSV parsing utility
 * Loads and parses inventory.csv using papaparse
 */

import Papa from 'papaparse';

/**
 * Loads and parses the inventory CSV file
 * @returns {Promise<Array>} Array of product objects
 */
export async function loadInventory() {
  try {
    const response = await fetch('/kashmira-shah/inventory.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const products = results.data
            .filter(row => row['Corrected Description'] && row['Corrected Description'].trim())
            .map(row => ({
              id: row['Corrected Description']?.trim() || '',
              name: row['Corrected Description']?.trim() || '',
              mrp: parseFloat(row['MRP (Per Pc)']?.replace(/[₹,]/g, '')) || 0,
              sellingPrice: parseFloat(row['Selling Price']?.replace(/[₹,]/g, '')) || 0,
              quantity: parseInt(row['Qty']?.trim()) || 0,
              category: row['Type']?.trim() || '',
              description: row['Matched Title']?.trim() || row['Corrected Description']?.trim() || '',
              setOf: row['Set of']?.trim() || '',
              url: row['Matched URL']?.trim() || '',
            }))
            .filter(product => product.name && product.sellingPrice > 0);
          
          resolve(products);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
}

