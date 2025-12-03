"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Shield, Eye, Database, UserCheck, Settings, AlertTriangle } from "lucide-react"

const PrivacyPolicy: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const sections = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us, such as when you book a consultation, contact us, or use our services. This includes: Personal identification information (name, email address, phone number), Professional information (company name, job title, industry), Project details and requirements, Files and documents you upload, Communication preferences, and Payment information (processed securely through our payment gateway).`,
    },
    {
      icon: Database,
      title: "2. How We Use Your Information",
      content: `We use the information we collect to: Provide, maintain, and improve our consulting services, Process and manage your consultation bookings, Communicate with you about our services, Send you technical notices and support messages, Respond to your comments and questions, Analyze usage patterns to improve our website and services, and Comply with legal obligations and protect our rights.`,
    },
    {
      icon: Shield,
      title: "3. Information Sharing and Disclosure",
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances: With service providers who assist us in operating our website and conducting our business, When required by law or to protect our rights and safety, In connection with a merger, acquisition, or sale of assets (with prior notice), and With your explicit consent for specific purposes.`,
    },
    {
      icon: UserCheck,
      title: "4. Data Security",
      content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes: Secure data transmission using SSL encryption, Regular security assessments and updates, Access controls and authentication measures, Secure data storage with backup systems, and Staff training on data protection practices.`,
    },
    {
      icon: Settings,
      title: "5. Your Rights and Choices",
      content: `You have the right to: Access the personal information we hold about you, Request correction of inaccurate or incomplete information, Request deletion of your personal information (subject to legal requirements), Object to or restrict certain processing of your information, Withdraw consent where processing is based on consent, and Receive a copy of your information in a portable format.`,
    },
    {
      icon: AlertTriangle,
      title: "6. Data Retention",
      content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. Consultation records are typically retained for 7 years for business and legal purposes. Marketing communications data is retained until you unsubscribe or request deletion.`,
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8"
              >
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark">{section.title}</h2>
                </div>
                <p className="text-gray leading-relaxed text-lg">{section.content}</p>
              </motion.div>
            ))}

            {/* Additional Sections */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray leading-relaxed text-lg mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. These
                technologies help us understand how you use our site, remember your preferences, and improve our
                services. You can control cookie settings through your browser preferences.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">8. International Data Transfers</h2>
              <p className="text-gray leading-relaxed text-lg mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure that
                such transfers are conducted in accordance with applicable data protection laws and that appropriate
                safeguards are in place to protect your information.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">9. Children's Privacy</h2>
              <p className="text-gray leading-relaxed text-lg mb-4">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
                information from children under 18. If we become aware that we have collected such information, we will
                take steps to delete it promptly.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-primary/5 rounded-2xl p-8 border border-primary/20"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">10. Contact Us About Privacy</h2>
              <p className="text-gray leading-relaxed text-lg mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray">
                <p>
                  <strong>Email:</strong> info@srdconsultingltd.com
                </p>
                <p>
                  <strong>Phone:</strong> +234 816 504 5779
                </p>
                <p>
                  <strong>Address:</strong> SRD Consulting Ltd, Nigeria
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
