import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/Layout';
import { Expense, DEFAULT_CATEGORIES } from '../types';
import { useAuth } from '../context/AuthContext';
import { COLORS, CURRENCY } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { 
  Filter, 
  Trash2, 
  Utensils, 
  Plane, 
  Receipt, 
  ShoppingBag, 
  MoreHorizontal, 
  Plus, 
  LogOut 
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const categoryIcons: Record<string, React.ReactNode> = {
  Food: <Utensils size={18} color="#fff" />,
  Travel: <Plane size={18} color="#fff" />,
  Bills: <Receipt size={18} color="#fff" />,
  Shopping: <ShoppingBag size={18} color="#fff" />,
  Other: <MoreHorizontal size={18} color="#fff" />,
};

export const Home: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const expensesPromise = supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      const categoriesPromise = supabase
        .from('categories')
        .select('name')
        .eq('user_id', user.id);

      const [expensesRes, categoriesRes] = await Promise.all([expensesPromise, categoriesPromise]);

      if (expensesRes.error) throw expensesRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setExpenses(expensesRes.data || []);
      setCustomCategories(categoriesRes.data?.map(c => c.name) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const deleteExpense = async (id: string) => {
    const confirmDelete = Platform.OS === 'web' 
      ? window.confirm('Are you sure you want to delete this expense?')
      : true;

    if (confirmDelete) {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) {
        if (Platform.OS === 'web') alert('Failed to delete expense');
        else Alert.alert('Error', 'Failed to delete expense');
      } else {
        setExpenses(expenses.filter((e) => e.id !== id));
      }
    }
  };

  const allCategories = ['All', ...DEFAULT_CATEGORIES, ...customCategories];

  const filteredExpenses = useMemo(() => {
    if (filter === 'All') return expenses;
    return expenses.filter((e) => e.category === filter);
  }, [expenses, filter]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [filteredExpenses]);

  const renderItem = ({ item }: { item: Expense }) => (
    <View>
      <GlassCard style={styles.expenseCard}>
        <View style={styles.expenseInfo}>
          <View style={styles.iconContainer}>
            {categoryIcons[item.category] || <MoreHorizontal size={18} color="#fff" />}
          </View>
          <View>
            <Text style={styles.expenseTitle}>{item.title}</Text>
            <Text style={styles.expenseMeta}>{item.category} • {new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        </View>
        <View style={styles.expenseAction}>
          <Text style={styles.expenseAmount}>
            <Text style={styles.currency}>{CURRENCY}</Text>
            {Number(item.amount).toLocaleString()}
          </Text>
          <TouchableOpacity 
            onPress={() => deleteExpense(item.id)}
            style={styles.deleteBtn}
          >
            <Trash2 size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </GlassCard>
    </View>
  );

  return (
    <Layout scrollable={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.email?.split('@')[0]}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
          <LogOut size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <GlassCard style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>Total Balance</Text>
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{filter}</Text>
            </View>
          </View>
          <Text style={styles.totalAmount}>
            <Text style={styles.totalCurrency}>{CURRENCY}</Text>
            {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
        </GlassCard>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={allCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setFilter(item)}
              style={[
                styles.filterChip,
                filter === item && styles.filterChipActive
              ]}
            >
              <Text style={[
                styles.filterChipText,
                filter === item && styles.filterChipTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Recent Activity</Text>
          <Text style={styles.listCount}>{filteredExpenses.length} items</Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color={COLORS.primary} size="large" />
            <Text style={styles.loaderText}>Syncing Data...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredExpenses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.expenseList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Filter size={48} color={COLORS.textMuted} style={{ opacity: 0.2 }} />
                <Text style={styles.emptyText}>No transactions found</Text>
              </View>
            }
          />
        )}
      </View>

      <TouchableOpacity 
        onPress={() => navigation.navigate('AddExpense')}
        style={styles.fab}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 24,
  },
  welcome: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'capitalize',
  },
  logoutBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  summaryCard: {
    padding: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  filterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
  },
  totalCurrency: {
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.6,
    marginRight: 4,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  filterChipTextActive: {
    color: COLORS.background,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  listCount: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  expenseList: {
    gap: 12,
    paddingBottom: 100,
  },
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  expenseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  expenseMeta: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  expenseAction: {
    alignItems: 'flex-end',
    gap: 8,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  currency: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.4,
  },
  deleteBtn: {
    padding: 4,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginTop: 12,
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
