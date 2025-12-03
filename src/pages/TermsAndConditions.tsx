"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Shield, FileText, CreditCard, RefreshCw, Users, Lock } from "lucide-react"

const TermsAndConditions: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: `By accessing and using the SRD Consulting Ltd website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      icon: Users,
      title: "2. Services Description",
      content: `SRD Consulting Ltd provides professional communications and public relations consulting services including but not limited to: Media Relations, Crisis Communication Management, Brand Storytelling, Language Interpretation, Language Translation, and Bespoke Consultancy services. All services are subject to availability and our professional assessment.`,
    },
    {
      icon: Shield,
      title: "3. Booking and Consultation Process",
      content: `When you book a consultation through our platform, you agree to provide accurate and complete information. We reserve the right to verify the information provided and may request additional documentation. Consultation appointments are subject to confirmation by our team within 24 hours of booking.`,
    },
    {
      icon: CreditCard,
      title: "4. Payment Terms",
      content: `Payment for services may be required in advance or as agreed upon during consultation. We accept payments through our integrated payment gateway powered by Paystack. All fees are non-negotiable unless otherwise agreed in writing. Invoices are due within 30 days of issuance unless otherwise specified.`,
    },
    {
      icon: RefreshCw,
      title: "5. Cancellation and Refund Policy",
      content: `Consultation bookings may be cancelled up to 48 hours before the scheduled appointment without penalty. For service cancellations approved by our administration team, refunds will be processed at 70% of the total amount paid, with 30% retained to cover administrative and processing costs. Refunds will be processed within 7-14 business days to the original payment method.`,
    },
    {
      icon: Lock,
      title: "6. Privacy and Data Collection",
      content: `We collect personal information including but not limited to: name, email address, phone number, company details, project information, and any files uploaded during the booking process. This information is used solely for service delivery, communication, and improving our services. We do not sell, trade, or transfer your personal information to third parties without your consent, except as required by law.`,
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Terms & <span className="text-primary">Conditions</span>
            </h1>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Please read these terms and conditions carefully before using our services. Last updated:{" "}
              {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
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

            {/* Additional Terms */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">7. Intellectual Property</h2>
              <p className="text-gray leading-relaxed text-lg mb-4">
                All content, materials, and intellectual property created by SRD Consulting Ltd remain our property
                unless otherwise agreed in writing. Client-provided materials remain the property of the client, and we
                will not use them beyond the scope of the agreed services.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">8. Limitation of Liability</h2>
              <p className="text-gray leading-relaxed text-lg mb-4">
                SRD Consulting Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from your use of our services.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">9. Confidentiality</h2>
              <p className="text-gray leading-relaxed text-lg mb-4">
                We maintain strict confidentiality regarding all client information and project details. All team
                members and contractors are bound by confidentiality agreements. We will not disclose any confidential
                information without prior written consent from the client, except as required by law.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">10. Governing Law</h2>
              <p className="text-gray leading-relaxed text-lg mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of Nigeria. Any
                disputes arising under these terms shall be subject to the exclusive jurisdiction of the Nigerian
                courts.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">11. Changes to Terms</h2>
              <p className="text-gray leading-relaxed text-lg mb-4">
                SRD Consulting Ltd reserves the right to modify these terms and conditions at any time. Changes will be
                effective immediately upon posting on our website. Your continued use of our services after any such
                changes constitutes your acceptance of the new terms.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-primary/5 rounded-2xl p-8 border border-primary/20"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">12. Contact Information</h2>
              <p className="text-gray leading-relaxed text-lg mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
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

      {/* CTA Section */}
      <section className="section-padding bg-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray mb-8">
              Now that you understand our terms, let's discuss how we can help transform your communications strategy.
            </p>
            <a href="/booking" className="btn-primary">
              Book Your Consultation
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default TermsAndConditions
