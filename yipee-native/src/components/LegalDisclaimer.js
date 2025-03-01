import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LegalDisclaimer = () => {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        <strong>LEGAL DISCLAIMER AND TERMS OF SERVICE</strong>
      </Text>

      <Text style={styles.text}>
        By registering for an account on our platform, you acknowledge that you have read, understood, and agree to be
        bound by the following terms and conditions:
      </Text>

      <Text style={styles.text}>
        <strong>1. ACCOUNT REGISTRATION</strong>
      </Text>

      <Text style={styles.text}>
        1.1 You represent and warrant that all information provided during the registration process is accurate,
        complete, and current. You agree to maintain and promptly update this information to keep it accurate, complete,
        and current.
      </Text>

      <Text style={styles.text}>
        1.2 You are responsible for maintaining the confidentiality of your account credentials, including your username
        and password. You agree to notify us immediately of any unauthorized use of your account or any other breach of
        security.
      </Text>

      <Text style={styles.text}>
        1.3 You acknowledge that we reserve the right to refuse service, terminate accounts, remove or edit content, or
        cancel orders at our sole discretion.
      </Text>

      <Text style={styles.text}>
        <strong>2. BUSINESS INFORMATION</strong>
      </Text>

      <Text style={styles.text}>
        2.1 You represent and warrant that you have the legal authority to register and operate the business identified
        in your registration.
      </Text>

      <Text style={styles.text}>
        2.2 You acknowledge that the business information provided may be verified by us or our third-party service
        providers, and you consent to such verification.
      </Text>

      <Text style={styles.text}>
        2.3 You agree to provide additional information or documentation as reasonably requested to verify your business
        identity or compliance with applicable laws.
      </Text>

      <Text style={styles.text}>
        <strong>3. PRIVACY AND DATA PROTECTION</strong>
      </Text>

      <Text style={styles.text}>
        3.1 The collection, use, and processing of your personal and business information is governed by our Privacy
        Policy, which is incorporated by reference into these Terms.
      </Text>

      <Text style={styles.text}>
        3.2 You acknowledge that we may share your information with third parties as necessary to provide our services,
        comply with legal obligations, or as otherwise permitted by our Privacy Policy.
      </Text>

      <Text style={styles.text}>
        <strong>4. INTELLECTUAL PROPERTY</strong>
      </Text>

      <Text style={styles.text}>
        4.1 All content, features, and functionality of our platform, including but not limited to text, graphics,
        logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive
        property of our company or our licensors and are protected by copyright, trademark, and other intellectual
        property laws.
      </Text>

      <Text style={styles.text}>
        <strong>5. LIMITATION OF LIABILITY</strong>
      </Text>

      <Text style={styles.text}>
        5.1 TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA,
        USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE
        THE SERVICE.
      </Text>

      <Text style={styles.text}>
        <strong>6. GOVERNING LAW</strong>
      </Text>

      <Text style={styles.text}>
        6.1 These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard
        to its conflict of law provisions.
      </Text>

      <Text style={styles.text}>
        <strong>7. CHANGES TO TERMS</strong>
      </Text>

      <Text style={styles.text}>
        7.1 We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
        material, we will provide at least 30 days' notice prior to any new terms taking effect.
      </Text>

      <Text style={styles.text}>
        <strong>8. CONTACT INFORMATION</strong>
      </Text>

      <Text style={styles.text}>
        8.1 Questions about the Terms should be sent to us at [contact email].
      </Text>

      <Text style={styles.text}>
        By clicking "I accept the terms and conditions," you acknowledge that you have read, understood, and agree to be
        bound by these Terms.
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
  },
});

export default LegalDisclaimer;