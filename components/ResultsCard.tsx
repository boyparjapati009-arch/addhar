import React from 'react';
import { AadhaarDetails } from '../types';

interface ResultsCardProps {
  details: AadhaarDetails;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="py-3 border-b border-slate-700/50">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="text-md font-medium text-slate-100">{value}</p>
  </div>
);

const ResultsCard: React.FC<ResultsCardProps> = ({ details }) => {
  return (
    <div className="w-full p-1 rounded-2xl bg-gradient-to-br from-cyan-500/50 to-purple-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-shadow duration-500 animate-fade-in">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
          Aadhaar Details
        </h2>
        <div className="space-y-2">
          <DetailItem label="Address" value={details.address} />
          <DetailItem label="District Name" value={details.homeDistName} />
          <DetailItem label="State Name" value={details.homeStateName} />
          <DetailItem label="Scheme Name" value={details.schemeName} />
          <DetailItem label="Allowed On ORC" value={details.allowed_onorc} />
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Member Details</h3>
          <div className="space-y-4">
            {details.members && details.members.length > 0 ? (
              details.members.map((member, index) => (
                <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="font-semibold text-cyan-400">{member.memName}</p>
                  <p className="text-sm text-slate-400">Relationship: {member.relation}</p>
                </div>
              ))
            ) : (
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <p className="text-slate-400">No member details available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;