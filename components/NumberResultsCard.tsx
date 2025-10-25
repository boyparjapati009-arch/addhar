import React from 'react';
import { NumberDetails } from '../types';

interface ResultsCardProps {
  details: NumberDetails;
}

const DetailItem: React.FC<{ label: string; value: string | null | undefined }> = ({ label, value }) => {
  if (!value || value === '-') return null;
  return (
    <div className="py-3 border-b border-slate-700/50">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-md font-medium text-slate-100 break-words">{value}</p>
    </div>
  );
};

const NumberResultsCard: React.FC<ResultsCardProps> = ({ details }) => {
  return (
    <div className="w-full p-1 rounded-2xl bg-gradient-to-br from-cyan-500/50 to-purple-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-shadow duration-500 animate-fade-in">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
          Number Details
        </h2>
        <div className="space-y-2">
          <DetailItem label="Name" value={details.name} />
          <DetailItem label="Mobile" value={details.mobile} />
          <DetailItem label="Alternate Mobile" value={details.altMobile} />
          <DetailItem label="Father's Name" value={details.father} />
          <DetailItem label="Address" value={details.address} />
          <DetailItem label="Circle / ISP" value={details.circleIsp} />
          <DetailItem label="Aadhaar" value={details.aadhar} />
          <DetailItem label="Email" value={details.email} />
        </div>
      </div>
    </div>
  );
};

export default NumberResultsCard;
