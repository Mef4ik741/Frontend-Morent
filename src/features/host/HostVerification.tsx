import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Upload, AlertCircle, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api/axiosConfig';

const STEPS = [
  { number: 1, title: 'Personal Info' },
  { number: 2, title: 'Documents' },
  { number: 3, title: 'Address' },
  { number: 4, title: 'Car Details' },
  { number: 5, title: 'Payment' }
];

export const HostVerification: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State Management
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      phone: '',
      dob: ''
    },
    documents: {
      passportNumber: '',
      passportUrl: '',
      licenseUrl: '',
      selfieUrl: ''
    },
    address: {
      street: '',
      city: '',
      zipCode: '',
      proofUrl: ''
    },
    carDetails: {
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      vin: '',
      color: '',
      transmission: 'Automatic',
      dailyPrice: '',
      photos: [] as string[]
    },
    payment: {
      bankName: '',
      accountNumber: '',
      termsAccepted: false
    }
  });

  const handleChange = (section: keyof typeof formData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    // Clear error when typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (section: keyof typeof formData, field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, upload to Cloudinary/S3 here and get URL. 
      // For now, we simulate a local URL for preview.
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      handleChange(section, field, fakeUrl);
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 1) {
      const fullName = formData.personalInfo.fullName.trim();
      const phone = formData.personalInfo.phone.trim();

      if (!fullName) {
        newErrors.fullName = 'Full name is required';
      }

      // Azerbaijani phone number: +994 XX XXX XX XX where XX is one of 55, 70, 51, 99, 77
      const azPhoneRegex = /^\+994\s?(55|70|51|99|77)\s?\d{3}\s?\d{2}\s?\d{2}$/;
      if (!phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!azPhoneRegex.test(phone)) {
        newErrors.phone = 'Enter a valid Azerbaijani number (+994 XX XXX XX XX)';
      }

      if (!formData.personalInfo.dob) {
        newErrors.dob = 'Date of birth is required';
      }
    }

    if (step === 3) {
      if (!formData.address.street) newErrors.street = 'Street address required';
      if (!formData.address.city) newErrors.city = 'City required';
    }

    if (step === 4) {
      if (!formData.carDetails.make) newErrors.make = 'Make required';
      if (!formData.carDetails.model) newErrors.model = 'Model required';
      if (!formData.carDetails.vin) newErrors.vin = 'VIN required';
      if (!formData.carDetails.licensePlate) newErrors.licensePlate = 'License plate required';
      if (!formData.carDetails.dailyPrice) newErrors.dailyPrice = 'Price required';
    }

    if (step === 5) {
      if (!formData.payment.bankName) newErrors.bankName = 'Bank name required';
      if (!formData.payment.accountNumber) newErrors.accountNumber = 'IBAN/Account required';
      if (!formData.payment.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Optionally we still prepare payload for logging/debugging
      const payload = {
        ...formData,
        submittedAt: new Date().toISOString()
      };
      console.log('Submitting verification payload:', payload);

      // Call backend to verify current user (user is taken from JWT on server)
      await api.post('/User/verify', {});

      navigate('/profile');
    } catch (error) {
      console.error('Failed to submit host verification', error);
      alert('Failed to submit verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label: string, value: string, section: keyof typeof formData, field: string, type: string = "text", placeholder: string = "") => (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => handleChange(section, field, e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand-500'} focus:outline-none transition-colors`}
        placeholder={placeholder}
      />
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  const renderFileUpload = (label: string, section: keyof typeof formData, field: string, value: string) => (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
        <input
          type="file"
          onChange={(e) => handleFileChange(section, field, e)}
          className="hidden"
          id={`file-${field}`}
          accept="image/*,.pdf"
        />
        <label htmlFor={`file-${field}`} className="cursor-pointer w-full h-full block">
          {value ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 size={24} />
              <span className="font-bold text-sm">File uploaded</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <Upload size={32} className="mb-2" />
              <span className="text-sm font-medium">Click to upload or drag and drop</span>
              <span className="text-xs mt-1">SVG, PNG, JPG or PDF (max. 5MB)</span>
            </div>
          )}
        </label>
      </div>
      {value && (
        <div className="mt-2 text-xs text-gray-500 text-center truncate max-w-xs mx-auto">
          Preview available
        </div>
      )}
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Host Verification</h1>
          <p className="text-gray-500 mt-2">Complete these steps to start earning</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10 mb-8 sticky top-4 z-20">
          <ProgressBar steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10">

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  {renderInput("Full Name", formData.personalInfo.fullName, "personalInfo", "fullName", "text", "Elvin Mammadov")}
                </div>
                {renderInput("Phone Number", formData.personalInfo.phone, "personalInfo", "phone", "tel", "+994 55 123 45 67")}
                {renderInput("Date of Birth", formData.personalInfo.dob, "personalInfo", "dob", "date")}
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Identity Verification</h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
                <AlertCircle className="text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-700">Your documents are stored securely and only used for verification purposes.</p>
              </div>

              {renderInput("Passport / ID Number", formData.documents.passportNumber, "documents", "passportNumber")}

              <div className="grid md:grid-cols-2 gap-6">
                {renderFileUpload("Upload Passport/ID (Front)", "documents", "passportUrl", formData.documents.passportUrl)}
                {renderFileUpload("Driver's License (Front)", "documents", "licenseUrl", formData.documents.licenseUrl)}
              </div>
              {renderFileUpload("Take a Selfie with ID", "documents", "selfieUrl", formData.documents.selfieUrl)}
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Address Verification</h2>
              {renderInput("Street Address", formData.address.street, "address", "street", "text", "Nizami Street 12")}
              <div className="grid grid-cols-2 gap-4">
                {renderInput("City", formData.address.city, "address", "city", "text", "Baku")}
                {renderInput("Zip Code", formData.address.zipCode, "address", "zipCode", "text", "AZ1000")}
              </div>
              {renderFileUpload("Proof of Residence (Utility Bill)", "address", "proofUrl", formData.address.proofUrl)}
            </div>
          )}

          {/* Step 4: Car Details */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Car Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {renderInput("Make (Brand)", formData.carDetails.make, "carDetails", "make", "text", "Toyota")}
                {renderInput("Model", formData.carDetails.model, "carDetails", "model", "text", "Prado")}
                {renderInput("Year", formData.carDetails.year, "carDetails", "year", "number", "2023")}
                {renderInput("Color", formData.carDetails.color, "carDetails", "color", "text", "White")}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-2">
                {renderInput("License Plate", formData.carDetails.licensePlate, "carDetails", "licensePlate", "text", "99-XX-999")}
                {renderInput("VIN Number", formData.carDetails.vin, "carDetails", "vin", "text", "XXXXXXXXXXXXXXXXX")}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Transmission</label>
                <div className="flex gap-4">
                  {['Automatic', 'Manual'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleChange('carDetails', 'transmission', type)}
                      className={`flex-1 py-3 px-4 rounded-xl border font-semibold transition-all ${formData.carDetails.transmission === type
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                {renderInput("Daily Rental Price (AZN)", formData.carDetails.dailyPrice, "carDetails", "dailyPrice", "number", "80")}
              </div>
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payout Information</h2>
              <p className="text-gray-500 text-sm mb-6">Enter the bank account where you would like to receive your earnings.</p>

              {renderInput("Bank Name", formData.payment.bankName, "payment", "bankName", "text", "Kapital Bank")}
              {renderInput("IBAN / Account Number", formData.payment.accountNumber, "payment", "accountNumber", "text", "AZ000000000000000000000000")}

              <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Review & Submit</h3>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Name: <span className="font-semibold text-gray-900">{formData.personalInfo.fullName}</span></li>
                  <li>• Car: <span className="font-semibold text-gray-900">{formData.carDetails.year} {formData.carDetails.make} {formData.carDetails.model}</span></li>
                  <li>• Price: <span className="font-semibold text-gray-900">{formData.carDetails.dailyPrice} AZN/day</span></li>
                </ul>

                <div className="mt-6 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.payment.termsAccepted}
                    onChange={(e) => handleChange('payment', 'termsAccepted', e.target.checked)}
                    className="mt-1 w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-500">
                    I confirm that the information provided is accurate and I agree to the <a href="#" className="text-brand-600 hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 hover:underline">Host Policy</a>.
                  </label>
                </div>
                {errors.termsAccepted && <p className="text-red-500 text-xs mt-2">{errors.termsAccepted}</p>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <ChevronLeft size={20} /> Back
            </button>

            <Button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-8"
            >
              {loading ? 'Processing...' : currentStep === 5 ? 'Submit Application' : 'Next Step'}
              {!loading && currentStep !== 5 && <ChevronRight size={20} />}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};