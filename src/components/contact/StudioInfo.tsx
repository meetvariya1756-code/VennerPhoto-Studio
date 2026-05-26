'use client';

import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function StudioInfo() {
  const contactDetails = [
    {
      icon: <MapPin className="w-5 h-5 text-[#C9A86C] shrink-0" />,
      label: 'Visit The Studio',
      content: 'B-27 Rangdarshan So-1 , Dhanmora , Katargam , Surat',
    },
    {
      icon: <Phone className="w-5 h-5 text-[#C9A86C] shrink-0" />,
      label: 'Direct Studio Line',
      content: '+91 98259 83437',
    },
    {
      icon: <Mail className="w-5 h-5 text-[#C9A86C] shrink-0" />,
      label: 'General Electronic Mail',
      content: 'vennerphoto@gmail.com',
    },
  ];

  return (
    <div className="flex flex-col gap-10 text-left font-sans">
      <div>
        <span className="text-[#C9A86C] text-xs font-semibold tracking-widest uppercase block mb-1">
          Venner Studio HQ
        </span>
        <h3 className="font-serif text-3xl font-light tracking-wide text-[#1A1A1A] mb-4">
          Studio Headquarters
        </h3>
        <p className="text-neutral-500 text-sm leading-relaxed max-w-md">
          Located in Katargam, Surat, our boutique studio is equipped with high-grade lighting, professional backgrounds, and dynamic styling lounges. Consultations are available by appointment.
        </p>
      </div>

      {/* Info Rows */}
      <div className="flex flex-col gap-6">
        {contactDetails.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center bg-white shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-0.5">
                {item.label}
              </p>
              <p className="text-[#1A1A1A] text-sm font-medium tracking-wide">
                {item.content}
              </p>
            </div>
          </div>
        ))}

        <div className="flex gap-4 border-t border-neutral-100 pt-6">
          <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center bg-white shrink-0">
            <Clock className="w-5 h-5 text-[#C9A86C] shrink-0" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-0.5">
              Operating Hours
            </p>
            <p className="text-[#1A1A1A] text-sm font-medium tracking-wide">
              Monday - Saturday: 9:00 AM - 8:00 PM
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">
              Sunday: Available By Appointment Only
            </p>
          </div>
        </div>
      </div>

      {/* Map Embed Frame */}
      <div className="w-full aspect-[4/3] bg-neutral-100 border border-neutral-200 overflow-hidden shadow-md">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.3462713549743!2d72.8274729!3d21.22271945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ebffcf5793f%3A0xf5564469239a54e7!2sVenner%20Photo%20Studio!5e1!3m2!1sen!2sin!4v1779775316406!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Venner Photo Studio Location Map"
        />
      </div>
    </div>
  );
}
