'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import Button from '../ui/Button';

// Validation Schema with Zod
const contactSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().email('Please enter a valid email address'),
  phone: zod.string().min(6, 'Please enter a valid phone number'),
  service: zod.string().min(1, 'Please select a service'),
  date: zod.string().min(1, 'Please choose a preferred date'),
  location: zod.string().optional(),
  message: zod.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = zod.infer<typeof contactSchema>;

const SERVICES_OPTIONS = [
  { value: 'wedding-photography', label: 'Wedding Photography' },
  { value: 'engagement-photography', label: 'Engagement Photography' },
  { value: 'baby-shower-photography', label: 'Baby Shower Photography' },
  { value: 'children-photography', label: 'Children Photography' },
  { value: 'indoor-studio-photography', label: 'Indoor Studio Photography' },
  { value: 'product-photography', label: 'Product Photography' },
  { value: 'modeling-photography', label: 'Modeling Photography' },
  { value: 'corporate-event-photography', label: 'Corporate Event Photography' },
  { value: 'birthday-photography', label: 'Birthday Photography' },
  { value: 'maternity-photography', label: 'Maternity Photography' },
  { value: 'general-inquiry', label: 'General Inquiry' },
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const prefilledService = searchParams.get('service') || '';
  const prefilledPackage = searchParams.get('package') || '';

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      location: '',
      message: '',
    },
  });

  // Prefill service & package details if passed via URL queries
  useEffect(() => {
    if (prefilledService) {
      setValue('service', prefilledService);
    }
    if (prefilledPackage) {
      setValue('message', `Hi Venner Team,\n\nI am interested in booking the "${prefilledPackage}" package for my upcoming event. Please let me know your availability.\n\nWarm regards!`);
    }
  }, [prefilledService, prefilledPackage, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Inquiry submitted successfully! We will contact you soon.');
        reset();
      } else {
        const errData = await response.json();
        toast.error(errData.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      toast.error('A server connection error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-neutral-200/60 p-8 md:p-10 shadow-xl flex flex-col gap-6 text-left rounded-none font-sans"
    >
      <div className="border-b border-neutral-100 pb-4 mb-2">
        <h3 className="font-serif text-2xl font-light text-[#1A1A1A] tracking-wide mb-1">
          Booking & Inquiries
        </h3>
        <p className="text-xs text-neutral-400 uppercase tracking-widest">
          Share your details below
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
            Full Name *
          </label>
          <input
            type="text"
            {...register('name')}
            placeholder="Rahul Patel"
            className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A86C] rounded-none transition-colors"
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
            Email Address *
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="you@example.com"
            className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A86C] rounded-none transition-colors"
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
            Phone Number *
          </label>
          <input
            type="tel"
            {...register('phone')}
            placeholder="+91 9087651234"
            className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A86C] rounded-none transition-colors"
          />
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </div>

        {/* Photography Category Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
            Interest Category *
          </label>
          <select
            {...register('service')}
            className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A86C] rounded-none bg-white transition-colors cursor-pointer"
          >
            <option value="">Select Offerings...</option>
            {SERVICES_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.service && <span className="text-xs text-red-500">{errors.service.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Preferred Date */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
            Preferred Date *
          </label>
          <input
            type="date"
            {...register('date')}
            className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A86C] rounded-none transition-colors cursor-pointer"
          />
          {errors.date && <span className="text-xs text-red-500">{errors.date.message}</span>}
        </div>

        {/* Event Location */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
            Event Location (Optional)
          </label>
          <input
            type="text"
            {...register('location')}
            placeholder="Surat, Gujarat"
            className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A86C] rounded-none transition-colors"
          />
        </div>
      </div>

      {/* Narrative Message */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
          Detailed Message *
        </label>
        <textarea
          rows={5}
          {...register('message')}
          placeholder="Tell us about your visual storytelling goals..."
          className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A86C] rounded-none resize-none transition-colors"
        />
        {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
      </div>

      {/* Submission Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1A1A1A] hover:bg-neutral-800 text-white font-sans text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-none transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Transmitting...
          </>
        ) : (
          'Send Inquiry'
        )}
      </button>
    </form>
  );
}
