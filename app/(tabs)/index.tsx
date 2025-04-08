import React from 'react';
import { Image, StyleSheet, ScrollView, TouchableOpacity, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const topics = [
    { title: 'Συστήματα Ηλεκτρικής Ενέργειας', description: 'Συζήτηση για τις ανανεώσιμες πηγές ενέργειας και τη διαχείριση δικτύου.' },
    { title: 'Ηλεκτρικά και Ηλεκτρονικά Κυκλώματα', description: 'Εξερεύνηση αυτοματισμών και εφαρμογών στα βιομηχανικά συστήματα.' },
    { title: 'Ηλεκτρικά Ισχύος', description: 'Ανακαλύψτε τις νεότερες τάσεις στην ηλεκτρονική μηχανική.' },
    { title: 'Μικροηλεκτρονική', description: 'Συζήτηση για την ανάπτυξη λογισμικού και υλικού.' },
    { title: 'Συστήματα Αυτομάτου Ελέγχου', description: 'Οι τελευταίες εξελίξεις σε δίκτυα 5G και πέρα.' },
    { title: 'Επεξεργασία Σήματος και Εικόνας', description: 'Τεχνολογίες αιχμής όπως AI και Blockchain.' },
    { title: 'Μηχανική και Βαθιά Μάθηση', description: 'Ανακαλύψτε τις νεότερες τάσεις στην μηχανική μάθηση και βαθιά μάθηση.' },
    { title: 'Δίκτυα Τηλεπικοινωνιών', description: 'Οι τελευταίες εξελίξεις σε δίκτυα τηλεπικοινωνιών.' },
    { title: 'Βάσεις Δεδομένων', description: 'Συζήτηση για την ανάπτυξη και διαχείριση βάσεων δεδομένων.' },
    { title: 'Έξυπνα Δίκτυα Ενέργειας και Τηλεπικοινωνιών', description: 'Οι τελευταίες εξελίξεις σε έξυπνα δίκτυα ενέργειας και τηλεπικοινωνιών.' },
    { title: 'Ασύρματη Μετάδοση και Δίκτυα Προηγμένης Γενιάς', description: 'Οι τελευταίες εξελίξεις σε ασύρματη μετάδοση και δίκτυα προηγμένης γενιάς.' },
    { title: 'Βιοϊατρική Τεχνολογία και Βιοπληροφορική', description: 'Ανακαλύψτε τις νεότερες τάσεις στην βιοϊατρική τεχνολογία και βιοπληροφορική.' },
    { title: 'Επιστημονικοί Υπολογισμοί', description: 'Συζήτηση για τις τελευταίες εξελίξεις στους επιστημονικούς υπολογισμούς.' },
    { title: 'Διαδίκτυο των Πραγμάτων', description: 'Οι τελευταίες εξελίξεις στο διαδίκτυο των πραγμάτων.' },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <ThemedView style={styles.heroSection}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.heroImage}
            resizeMode="contain"
          />
          
          <ThemedText type="title" style={styles.heroTitle}>ΣΦΗΜΜΥ 16</ThemedText>
          
          <ThemedText style={styles.heroSubtitle}>
            16ο Συνέδριο Φοιτητών Ηλεκτρολόγων Μηχανικών και Μηχανικών Υπολογιστών
          </ThemedText>
          
          <ThemedText style={styles.heroDescription}>
            Φέτος, το ΣΦΗΜΜΥ θα διεξαχθεί στη Θεσσαλονίκη, το τριήμερο 25 με 27 Απριλίου, 
            συγκεντρώνοντας φοιτητές, ακαδημαϊκούς και επαγγελματίες σε ένα περιβάλλον 
            γνώσης, καινοτομίας και networking!
          </ThemedText>
          
          <TouchableOpacity style={styles.learnMoreButton}>
            <ThemedText style={styles.learnMoreText}>Μάθετε Περισσότερα</ThemedText>
          </TouchableOpacity>
          
          <ThemedView style={styles.countdownContainer}>
            <ThemedView style={styles.countdownItem}>
              <ThemedText style={styles.countdownNumber}>16</ThemedText>
              <ThemedText style={styles.countdownLabel}>ο</ThemedText>
            </ThemedView>
            <ThemedView style={styles.countdownDivider} />
            <ThemedView style={styles.countdownItem}>
              <ThemedText style={styles.countdownLabel}>Συνέδριο</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        
        {/* Conference Visual */}
        <ThemedView style={styles.conferenceVisualContainer}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.conferenceVisualImage}
            resizeMode="cover"
          />
          <ThemedView style={styles.conferenceVisualOverlay}>
            <ThemedText style={styles.conferenceVisualText}>Conference Visual</ThemedText>
          </ThemedView>
        </ThemedView>
        
        {/* About Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>Σχετικά</ThemedText>
          
          <ThemedText type="subtitle" style={styles.aboutTitle}>
            Τι είναι το ΣΦΗΜΜΥ;
          </ThemedText>
          
          <ThemedText style={styles.aboutText}>
            Το ΣΦΗΜΜΥ (Συνέδριο Φοιτητών Ηλεκτρολόγων Μηχανικών και Μηχανικών Υπολογιστών) 
            είναι το μεγαλύτερο φοιτητικό συνέδριο του κλάδου στην Ελλάδα. Διοργανώνεται κάθε 
            χρόνο από φοιτητές για φοιτητές, με στόχο τη διάδοση της γνώσης, την ανταλλαγή ιδεών 
            και τη δικτύωση των συμμετεχόντων.
          </ThemedText>
          
          <ThemedText style={styles.aboutText}>
            Ξεκίνησε το 2007 στην Αθήνα και, από τότε, έχει εξελιχθεί σε έναν σημαντικό θεσμό που 
            εδώ και πάνω από 15 χρόνια φέρνει κοντά φοιτητές, ακαδημαϊκούς και επαγγελματίες του χώρου. 
            Κατά τη διάρκεια του συνεδρίου, οι συμμετέχοντες έχουν την ευκαιρία να παρακολουθήσουν ομιλίες, 
            workshops, παρουσιάσεις ερευνητικών εργασιών (papers), καθώς και να συμμετάσχουν σε διαγωνισμούς 
            και άλλες παράλληλες δράσεις. Παράλληλα, διεξάγεται το PreΣΦΗΜΜΥ 9, ένα Hackathon με θέμα την 
            επίλυση προβλημάτων σε κυβερνοφυσικά συστήματα, τη διοργάνωση του οποίου έχει αναλάβει το ISSEL 
            Group (Intelligent Systems and Software Engineering Labgroup). Επιπλέον, στο Career@ΣΦΗΜΜΥ, οι 
            συμμετέχοντες θα έχουν τη δυνατότητα να έρθουν σε επαφή με εταιρείες του κλάδου μέσα από παρουσιάσεις, 
            εταιρικά stands και συνεντεύξεις, στέλνοντας το βιογραφικό τους και διεκδικώντας ευκαιρίες καριέρας.
          </ThemedText>
          
          <ThemedText style={styles.aboutText}>
            Φέτος, το ΣΦΗΜΜΥ θα διεξαχθεί για 5η φορά στη Θεσσαλονίκη, υπό την αιγίδα του Τμήματος 
            Ηλεκτρολόγων Μηχανικών & Μηχανικών Υπολογιστών του ΑΠΘ και της Περιφέρειας Κεντρικής Μακεδονίας, 
            φιλοξενώντας τις δραστηριότητές του σε διάφορους χώρους του Αριστοτελείου Πανεπιστημίου Θεσσαλονίκης.
          </ThemedText>
        </ThemedView>
        
        {/* Topics Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>Θέματα Συνεδρίου</ThemedText>
          
          <View style={styles.topicsGrid}>
            {topics.map((topic, index) => (
              <ThemedView key={index} style={styles.topicCard}>
                <ThemedText type="defaultSemiBold" style={styles.topicTitle}>{topic.title}</ThemedText>
                <ThemedText style={styles.topicDescription}>{topic.description}</ThemedText>
              </ThemedView>
            ))}
          </View>
        </ThemedView>
        
        {/* Footer */}
        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerTitle}>Logo</ThemedText>
          <ThemedText style={styles.footerSubtitle}>Υπό την αιγίδα</ThemedText>
          <ThemedText style={styles.footerLogos}>ΤΗΜΜΥΑΟΘΠΚΜ</ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  heroDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    opacity: 0.8,
  },
  learnMoreButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 32,
  },
  learnMoreText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  countdownItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  countdownLabel: {
    fontSize: 16,
  },
  countdownDivider: {
    height: 40,
    width: 1,
    backgroundColor: '#0a7ea4',
    marginHorizontal: 20,
  },
  conferenceVisualContainer: {
    height: 200,
    width: '100%',
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  conferenceVisualImage: {
    width: '100%',
    height: '100%',
  },
  conferenceVisualOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conferenceVisualText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  aboutTitle: {
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'justify',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  topicCard: {
    width: width / 2 - 32,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    minHeight: 120,
  },
  topicTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.7,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footerSubtitle: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  footerLogos: {
    fontSize: 16,
    fontWeight: '500',
  }
});