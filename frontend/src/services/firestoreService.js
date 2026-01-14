import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const ITEMS_COLLECTION = 'grocery_items';

/**
 * Get all items for a user with optional filters
 */
export const getItems = async (userEmail, filters = {}) => {
  try {
    if (!userEmail) {
      throw new Error('User email is required');
    }

    // Build query
    let q = query(
      collection(db, ITEMS_COLLECTION),
      where('user_email', '==', userEmail),
      orderBy('name', 'asc')
    );

    // Execute query
    const querySnapshot = await getDocs(q);
    let items = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamps to ISO strings
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        expiration_date: data.expiration_date?.toDate?.()?.toISOString()?.split('T')[0] || data.expiration_date
      });
    });

    // Apply filters client-side (Firestore doesn't support ILIKE for case-insensitive search)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      items = items.filter(item => item.category === filters.category);
    }

    if (filters.lowStock === true || filters.lowStock === 'true') {
      items = items.filter(item => item.quantity < 10);
    }

    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

/**
 * Get a single item by ID
 */
export const getItem = async (itemId, userEmail) => {
  try {
    if (!userEmail) {
      throw new Error('User email is required');
    }

    // Get all items for user and find the one with matching ID
    const items = await getItems(userEmail);
    const item = items.find(i => i.id === itemId);

    if (!item) {
      throw new Error('Item not found');
    }

    return item;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
};

/**
 * Create a new item
 */
export const createItem = async (itemData, userEmail) => {
  try {
    if (!userEmail) {
      throw new Error('User email is required');
    }

    const { name, category, quantity, price, expiration_date } = itemData;

    if (!name || !category || quantity === undefined || price === undefined) {
      throw new Error('Missing required fields');
    }

    // Prepare data for Firestore
    const firestoreData = {
      name,
      category,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
      user_email: userEmail,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    };

    // Add expiration_date if provided
    if (expiration_date) {
      firestoreData.expiration_date = Timestamp.fromDate(new Date(expiration_date));
    }

    const docRef = await addDoc(collection(db, ITEMS_COLLECTION), firestoreData);

    return {
      id: docRef.id,
      ...firestoreData,
      created_at: firestoreData.created_at.toDate().toISOString(),
      updated_at: firestoreData.updated_at.toDate().toISOString(),
      expiration_date: firestoreData.expiration_date?.toDate().toISOString().split('T')[0] || null
    };
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

/**
 * Update an existing item
 */
export const updateItem = async (itemId, itemData, userEmail) => {
  try {
    if (!userEmail) {
      throw new Error('User email is required');
    }

    // First verify the item belongs to the user
    const existingItem = await getItem(itemId, userEmail);

    const { name, category, quantity, price, expiration_date } = itemData;

    // Prepare data for Firestore
    const firestoreData = {
      name,
      category,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
      updated_at: Timestamp.now()
    };

    // Add expiration_date if provided
    if (expiration_date) {
      firestoreData.expiration_date = Timestamp.fromDate(new Date(expiration_date));
    } else {
      firestoreData.expiration_date = null;
    }

    const itemRef = doc(db, ITEMS_COLLECTION, itemId);
    await updateDoc(itemRef, firestoreData);

    return {
      id: itemId,
      ...existingItem,
      ...firestoreData,
      updated_at: firestoreData.updated_at.toDate().toISOString(),
      expiration_date: firestoreData.expiration_date?.toDate().toISOString().split('T')[0] || null
    };
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

/**
 * Delete an item
 */
export const deleteItem = async (itemId, userEmail) => {
  try {
    if (!userEmail) {
      throw new Error('User email is required');
    }

    // First verify the item belongs to the user
    await getItem(itemId, userEmail);

    const itemRef = doc(db, ITEMS_COLLECTION, itemId);
    await deleteDoc(itemRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

/**
 * Get all unique categories for a user
 */
export const getCategories = async (userEmail) => {
  try {
    if (!userEmail) {
      throw new Error('User email is required');
    }

    const items = await getItems(userEmail);
    const categories = [...new Set(items.map(item => item.category))];
    return categories.sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
