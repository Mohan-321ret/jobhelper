import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const interviewModes = [
    {
      title: "AI Interview",
      desc: "Role & experience based questions",
      icon: "laptop",
      colors: ['#38BDF8', '#0EA5E9'],
      route: "InterviewSetup"
    },
    {
      title: "Resume Interview",
      desc: "Questions from your resume",
      icon: "document-text",
      colors: ['#10B981', '#059669'],
      route: "ResumeSetup"
    },
    {
      title: "HR Interview",
      desc: "Communication & personality",
      icon: "people",
      colors: ['#8B5CF6', '#7C3AED'],
      route: "Interview",
      params: { mode: "hr" }
    },
    {
      title: "Rapid Fire",
      desc: "Think fast under pressure",
      icon: "flash",
      colors: ['#F59E0B', '#D97706'],
      route: "Interview",
      params: { mode: "rapid" }
    }
  ];

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.title}>JobHelper</Text>
              <Text style={styles.email}>{auth.currentUser?.email}</Text>
            </View>
            
            <TouchableOpacity style={styles.profileIcon} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Choose Interview Mode</Text>
            
            <View style={styles.cardsGrid}>
              {interviewModes.map((mode, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.cardWrapper}
                  onPress={() => navigation.navigate(mode.route, mode.params)}
                >
                  <LinearGradient colors={mode.colors} style={styles.card}>
                    <View style={styles.cardIcon}>
                      <Ionicons name={mode.icon} size={32} color="#FFF" />
                    </View>
                    <Text style={styles.cardTitle}>{mode.title}</Text>
                    <Text style={styles.cardDesc}>{mode.desc}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.statsSection}>
              <Text style={styles.statsTitle}>Your Progress</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Interviews</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>8.5</Text>
                  <Text style={styles.statLabel}>Avg Score</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>85%</Text>
                  <Text style={styles.statLabel}>Success Rate</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#64748B',
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E5E7EB',
    marginBottom: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 16,
  },
  statsSection: {
    marginTop: 8,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E5E7EB',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
