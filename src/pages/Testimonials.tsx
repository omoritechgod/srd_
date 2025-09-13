import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../services/api";

interface Testimonial {
  id: string;
  name: string;
  org?: string;
  rating?: number;
  text: string;
  photo?: string;
  approved: string | boolean;
  createdAt: string;
}

interface TestimonialForm {
  readonly id: string;
  name: string;
  org: string;
  rating: number;
  text: string;
  photo?: string | FileList;
  approved: string | boolean;
  createdAt: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      org: "Tech Innovations Ltd",
      rating: 5,
      text: "SRD Consulting transformed our communication strategy completely. Their strategic approach and attention to detail helped us navigate a complex product launch successfully.",
      photo:
        "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
      approved: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Michael Chen",
      org: "Global Manufacturing Corp",
      rating: 5,
      text: "During our crisis situation, SRD provided exceptional guidance and support. Their crisis communication expertise helped us maintain stakeholder confidence.",
      photo:
        "https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=400",
      approved: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      org: "Healthcare Solutions Inc",
      rating: 5,
      text: "The team at SRD helped us develop a compelling brand story that resonated with our audience. Their creativity and strategic thinking are unmatched.",
      photo:
        "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400",
      approved: true,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialForm>();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get(
          "https://api.sheetbest.com/sheets/188fec19-5dd2-480c-9531-269673512323"
        );
        setTestimonials(
          response.data.filter((t: Testimonial) => t.approved === "TRUE")
        );
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        // Fallback demo testimonials
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const onSubmit = async (data: TestimonialForm) => {
    setSubmitting(true);
    try {
      let photoUrl = "";
      let uuid = "srd-" + crypto.randomUUID();

      // Handle photo upload if provided
      if (data.photo && data.photo[0]) {
        const photoFile = new FormData();
        photoFile.append("file", data.photo[0]);
        photoFile.append("upload_preset", "testimonials");
        photoFile.append("folder", "srdtestimonails");

        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dbvcdwf10/image/upload",
          {
            method: "POST",
            body: photoFile,
          }
        );
        const photoData = await uploadResponse.json();

        if (uploadResponse.ok) {
          photoUrl = photoData.secure_url;
        } else {
          console.error("Failed to upload photo:", photoData);
        }
      }

      const payload: TestimonialForm = {
        id: uuid,
        name: data.name,
        org: data.org,
        rating: data.rating,
        text: data.text,
        createdAt: new Date().toISOString(),
        approved: false, //default to false until approved by admin
        photo: photoUrl,
      };

      // Submit the testimonial to the API
      const response = await api.post(
        "https://api.sheetbest.com/sheets/188fec19-5dd2-480c-9531-269673512323",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status !== 200) {
        alert("failed to submit testimonial");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit testimonial:", error);
      alert("Failed to submit testimonial. Please try again.");
    } finally {
      setSubmitting(false);
      reset();
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Client <span className="text-primary">Success Stories</span>
            </h1>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Hear from our clients about how SRD Consulting has helped them
              achieve their communication goals and drive meaningful results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center"
                >
                  <Quote className="w-12 h-12 text-primary mx-auto mb-6" />

                  <p className="text-xl md:text-2xl text-dark mb-8 leading-relaxed italic">
                    "{testimonials[currentIndex].text}"
                  </p>

                  {testimonials[currentIndex].rating && (
                    <div className="flex justify-center mb-6">
                      {renderStars(testimonials[currentIndex].rating!)}
                    </div>
                  )}

                  <div className="flex items-center justify-center">
                    {testimonials[currentIndex].photo && (
                      <img
                        src={testimonials[currentIndex].photo}
                        alt={testimonials[currentIndex].name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-dark">
                        {testimonials[currentIndex].name}
                      </h4>
                      {testimonials[currentIndex].org && (
                        <p className="text-gray">
                          {testimonials[currentIndex].org}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={prevTestimonial}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-dark" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-dark" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {testimonials.length > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Submission Form */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Share Your Experience
            </h2>
            <p className="text-xl text-gray">
              We'd love to hear about your experience working with SRD
              Consulting
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4">Thank You!</h3>
              <p className="text-gray mb-6">
                Your testimonial has been submitted and is awaiting approval. We
                appreciate you taking the time to share your experience.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary"
              >
                Submit Another
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="input-field"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Organization
                    </label>
                    <input
                      {...register("org")}
                      className="input-field"
                      placeholder="Your organization"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Rating *
                  </label>
                  <select
                    {...register("rating", {
                      required: "Rating is required",
                      valueAsNumber: true,
                    })}
                    className="input-field"
                  >
                    <option value="">Select a rating</option>
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                  {errors.rating && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rating.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Your Testimonial *
                  </label>
                  <textarea
                    {...register("text", {
                      required: "Testimonial is required",
                    })}
                    rows={5}
                    className="input-field resize-none"
                    placeholder="Share your experience working with SRD Consulting..."
                  />
                  {errors.text && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.text.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Photo (Optional)
                  </label>
                  <input
                    {...register("photo")}
                    type="file"
                    accept="image/*"
                    className="input-field"
                  />
                  <p className="text-sm text-gray mt-1">
                    Upload a professional photo (optional)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Testimonial"}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
