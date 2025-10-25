import React, { useState, useCallback } from 'react';
import { AadhaarDetails } from './types';
import SearchCard from './components/SearchCard';
import ResultsCard from './components/ResultsCard';
import Loader from './components/Loader';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('');
  const [details, setDetails] = useState<AadhaarDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (aadhaarNumber.length !== 12 || !/^\d+$/.test(aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDetails(null);

    try {
      const targetUrl = `https://apibymynk.vercel.app/fetch?key=onlymynk&aadhaar=${aadhaarNumber}`;
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const response = await fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`);
      
      if (!response.ok) {
        throw new Error(`The server responded with an error (Status: ${response.status})`);
      }
      
      const data = await response.json();

      // The API explicitly returns `status: false` for invalid or unfound Aadhaar numbers.
      if (data.status === false) {
        setError(data.msg || 'No results found for this Aadhaar number. Please check the number and try again.');
        setDetails(null);
      } else {
        // For successful responses, the details might be at the root of the response object
        // or nested inside a `data` property.
        const aadhaarData = data.data || data;

        // Validate that the response contains at least a core field like 'address'.
        if (aadhaarData && aadhaarData.address) {
          // The API returns member details under 'memberDetailsList' with different property names.
          // We map this to the 'members' array our components expect.
          let members = [];
          if (Array.isArray(aadhaarData.memberDetailsList)) {
            members = aadhaarData.memberDetailsList.map((apiMember: any) => ({
              memName: apiMember.memberName,
              relation: apiMember.releationship_name,
            }));
          } else if (Array.isArray(aadhaarData.members)) {
            // Fallback for the old structure, just in case.
            members = aadhaarData.members;
          }

          const finalDetails = {
            ...aadhaarData,
            members: members,
          };
          setDetails(finalDetails);
        } else {
          setError('Received an invalid or unexpected response from the server. Please try again.');
          setDetails(null);
        }
      }
    } catch (err) {
      console.error(err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Could not connect to the server. Please check your internet connection and try again.');
      } else if (err instanceof SyntaxError) {
        // This can happen if the proxy returns non-JSON, like an HTML error page.
        setError('Received an invalid response from the API service. It might be temporarily unavailable.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [aadhaarNumber]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-700/[0.05] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,white)]"></div>
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(50%_50%_at_50%_50%,transparent,black)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-tr from-indigo-600/40 to-purple-600/40 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <main className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center flex-grow z-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
            Aadhaar Info Finder
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Instantly fetch Aadhaar details with a secure and modern interface.
          </p>
        </header>

        <SearchCard
          aadhaarNumber={aadhaarNumber}
          setAadhaarNumber={setAadhaarNumber}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        
        <div className="w-full mt-8">
          {isLoading && <Loader />}
          {error && !isLoading && (
            <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl animate-fade-in">
              <p className="font-medium text-red-400">{error}</p>
            </div>
          )}
          {details && !isLoading && <ResultsCard details={details} />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
