
import { supabase } from '@/lib/supabase';

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: 'calculation' | 'conversion' | 'color';
  data: any;
  created_at: string;
}

export const savedItemsService = {
  async getSavedItems(user_id: string, item_type?: string): Promise<SavedItem[]> {
    let query = supabase
      .from('saved_items')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    
    if (item_type) {
      query = query.eq('item_type', item_type);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching saved items:', error);
      return [];
    }
    
    return data || [];
  },
  
  async saveItem(user_id: string, item_type: 'calculation' | 'conversion' | 'color', data: any): Promise<SavedItem | null> {
    const { data: savedItem, error } = await supabase
      .from('saved_items')
      .insert({
        user_id,
        item_type,
        data,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving item:', error);
      return null;
    }
    
    return savedItem;
  },
  
  async deleteItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting item:', error);
      return false;
    }
    
    return true;
  }
};
