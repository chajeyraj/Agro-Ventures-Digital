import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { GlassCard } from '../components/GlassCard';
import { COLORS, CURRENCY } from '../theme';
import { DEFAULT_CATEGORIES } from '../types';
import { 
  Plus, 
  Tag, 
  DollarSign, 
  Type, 
  ChevronLeft, 
  Check, 
  X 
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const AddExpense: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomCategories();
  }, [user]);

  const fetchCustomCategories = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('user_id', user.id);
      
      if (error) throw error;
      if (data) {
        setCustomCategories(data.map(c => c.name));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !user) return;
    
    const name = newCategoryName.trim();
    if (allCategories.includes(name)) {
      setCategory(name);
      setIsAddingNewCategory(false);
      setNewCategoryName('');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ name, user_id: user.id }]);
      
      if (error) throw error;
      
      setCustomCategories(prev => [...prev, name]);
      setCategory(name);
      setIsAddingNewCategory(false);
      setNewCategoryName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.from('expenses').insert([
      {
        user_id: user.id,
        title: title.trim(),
        amount: numAmount,
        category,
      },
    ]);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigation.goBack();
    }
  };

  return (
    <Layout scrollable={false}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Add Expense</Text>
            <Text style={styles.subtitle}>Record your spending</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.formContainer}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          <GlassCard style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>What for?</Text>
              <View style={styles.inputWrapper}>
                <Type size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  placeholder="e.g. Dinner with friends"
                  placeholderTextColor={COLORS.textMuted}
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>How much? ({CURRENCY})</Text>
              <View style={styles.inputWrapper}>
                <DollarSign size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textMuted}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  style={[styles.input, styles.amountInput]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.categoryHeader}>
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity 
                  onPress={() => setIsAddingNewCategory(!isAddingNewCategory)}
                  style={styles.newCategoryBtn}
                >
                  {isAddingNewCategory ? (
                    <X size={12} color={COLORS.textMuted} />
                  ) : (
                    <Plus size={12} color={COLORS.textMuted} />
                  )}
                  <Text style={styles.newCategoryText}>
                    {isAddingNewCategory ? 'Cancel' : 'New Category'}
                  </Text>
                </TouchableOpacity>
              </View>

              {isAddingNewCategory ? (
                <View style={styles.newCategoryRow}>
                  <View style={[styles.inputWrapper, { flex: 1 }]}>
                    <Tag size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                    <TextInput
                      placeholder="Category Name"
                      placeholderTextColor={COLORS.textMuted}
                      value={newCategoryName}
                      onChangeText={setNewCategoryName}
                      autoFocus
                      style={styles.input}
                    />
                  </View>
                  <TouchableOpacity 
                    onPress={handleAddCategory}
                    style={styles.checkBtn}
                  >
                    <Check size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.categoryGrid}>
                  {allCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.categoryChip,
                        category === cat && styles.categoryChipActive
                      ]}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        category === cat && styles.categoryChipTextActive
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity 
              onPress={handleSave}
              disabled={loading}
              style={styles.submitBtn}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Plus size={20} color="#fff" />
                  <Text style={styles.submitBtnText}>Save Expense</Text>
                </>
              )}
            </TouchableOpacity>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
    marginBottom: 24,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: '#fff',
    fontSize: 14,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '900',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newCategoryText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  newCategoryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  checkBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.2)',
    marginBottom: 24,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
