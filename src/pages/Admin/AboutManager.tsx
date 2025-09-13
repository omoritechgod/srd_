import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Save, Upload, X, ArrowLeft } from "lucide-react";
import api from "../../services/api";

interface AboutContent {
  content: string;
  image?: string;
}

interface AboutForm {
  id: number | string;
  content: string;
  image?: string | FileList;
}

const AboutManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AboutForm>();

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await api.get("https://api.sheetbest.com/sheets/6743decf-22be-4c3b-9b1f-00a733e5da50");
      const data = response.data;
      setValue("content", data.content[0]);
      setCurrentImage(data.image[0] || "");
    } catch (error) {
      console.error("Failed to fetch about content:", error);
      // Set default content
      setValue(
        "content",
        `SRD Consulting Ltd is a premier communications and public relations firm dedicated to helping organizations navigate the complex landscape of modern communication.

Founded on the principles of strategic thinking, creative execution, and measurable results, we provide tailored solutions that drive meaningful engagement and business growth.

Our team of seasoned professionals brings together decades of experience in media relations, crisis communication, brand storytelling, and strategic consultancy. We understand that every organization has a unique story to tell, and we're here to help you tell it effectively.

Whether you're looking to build brand awareness, manage a crisis, or develop a comprehensive communication strategy, SRD Consulting is your trusted partner in achieving communication excellence.`
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AboutForm) => {
    setSubmitting(true);
    try {
      let imageUrl = "";

      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append("file", data.image[0]);
        formData.append("upload_preset", "testimonials");
        formData.append("folder", "srdtestimonails");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dbvcdwf10/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const photoData = await response.json();

        if (response.ok) {
          imageUrl = photoData.secure_url;
        }else{
          console.error("Image upload failed:", response.statusText);
        }
      }

      const payload: AboutForm = {
        id: 1,
        content: data.content,
        image: imageUrl || currentImage,
      }
      console.log(payload,data.image && data.image[0])

      const req = await api.patch(`https://api.sheetbest.com/sheets/6743decf-22be-4c3b-9b1f-00a733e5da50/id/1`,payload);

      if (req.status === 200) {
        alert("About content updated successfully!");
        await fetchAboutContent();
        setPreviewImage("");
      }
    } catch (error) {
      console.error("Failed to update about content:", error);
      alert("Failed to update content. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePreviewImage = () => {
    setPreviewImage("");
    setValue("image", undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center text-gray hover:text-primary mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-dark">
                About Page Management
              </h1>
              <p className="text-gray">
                Update about us content and banner image
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Content Editor */}
            <div>
              <label className="block text-lg font-semibold text-dark mb-4">
                About Us Content
              </label>
              <textarea
                {...register("content", { required: "Content is required" })}
                rows={15}
                className="input-field resize-none font-mono text-sm"
                placeholder="Enter the about us content..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.content.message}
                </p>
              )}
              <p className="text-sm text-gray mt-2">
                Use line breaks to separate paragraphs. The content will be
                displayed as formatted text.
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-lg font-semibold text-dark mb-4">
                Banner Image
              </label>

              {/* Current Image */}
              {currentImage && !previewImage && (
                <div className="mb-4">
                  <p className="text-sm text-gray mb-2">Current Image:</p>
                  <img
                    src={currentImage}
                    alt="Current about banner"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Preview Image */}
              {previewImage && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray">New Image Preview:</p>
                    <button
                      type="button"
                      onClick={removePreviewImage}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <Upload className="w-8 h-8 text-gray mx-auto mb-2" />
                <p className="text-gray mb-2">
                  {currentImage
                    ? "Upload new banner image"
                    : "Upload banner image"}
                </p>
                <input
                  {...register("image", {
                    onChange: handleImageChange
                  })}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="btn-secondary cursor-pointer inline-block"
                >
                  Choose Image
                </label>
                <p className="text-xs text-gray mt-2">
                  Recommended: 1200x600px, JPG or PNG format
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update About Page
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl shadow-sm p-8"
        >
          <h2 className="text-xl font-semibold text-dark mb-4">Live Preview</h2>
          <div className="border rounded-lg p-6 bg-gray-50">
            <p className="text-sm text-gray mb-4">
              This is how your content will appear on the About page:
            </p>
            <div className="bg-white rounded-lg p-6">
              <a
                href="/about"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-block mb-4"
              >
                View Live About Page
              </a>
              <p className="text-gray">
                Click the button above to see the current live version of your
                About page.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AboutManager;
