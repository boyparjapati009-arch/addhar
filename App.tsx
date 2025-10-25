import React, { useState, useCallback } from 'react';
import { AadhaarDetails, NumberDetails } from './types';
import { fetchProtectedAadhaars, fetchProtectedNumbers } from './protection';
import { getRecentSearches, addRecentSearch } from './storage';

// Aadhaar components
import SearchCard from './components/SearchCard';
import ResultsCard from './components/ResultsCard';

// Number Info components
import NumberSearchCard from './components/NumberSearchCard';
import NumberResultsCard from './components/NumberResultsCard';

// Shared components
import Loader from './components/Loader';
import Footer from './components/Footer';
import RecentSearches from './components/RecentSearches';

type View = 'home' | 'aadhaar' | 'number';

const App: React.FC = () => {
  // Global state
  const [view, setView] = useState<View>('home');
  
  // Aadhaar search state
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('');
  const [aadhaarDetails, setAadhaarDetails] = useState<AadhaarDetails | null>(null);
  const [isAadhaarLoading, setIsAadhaarLoading] = useState<boolean>(false);
  const [aadhaarError, setAadhaarError] = useState<string | null>(null);
  const [recentAadhaars, setRecentAadhaars] = useState<string[]>(() => getRecentSearches('recentAadhaars'));

  // Number info state
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [numberDetails, setNumberDetails] = useState<NumberDetails | null>(null);
  const [isNumberLoading, setIsNumberLoading] = useState<boolean>(false);
  const [numberError, setNumberError] = useState<string | null>(null);
  const [recentNumbers, setRecentNumbers] = useState<string[]>(() => getRecentSearches('recentNumbers'));

  const handleAadhaarSearch = useCallback(async (searchNumber: string) => {
    if (searchNumber.length !== 12 || !/^\d+$/.test(searchNumber)) {
      setAadhaarError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    
    setIsAadhaarLoading(true);
    setAadhaarError(null);
    setAadhaarDetails(null);

    try {
      const protectedAadhaars = await fetchProtectedAadhaars();
      if (protectedAadhaars.includes(searchNumber)) {
        setAadhaarError('This Aadhaar number is protected and cannot be searched.');
        return;
      }

      const targetUrl = `https://apibymynk.vercel.app/fetch?key=onlymynk&aadhaar=${searchNumber}`;
      const proxyUrl = 'https://corsproxy.io/?';
      const response = await fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`);
      
      if (!response.ok) {
        throw new Error(`The server responded with an error (Status: ${response.status})`);
      }
      
      const data = await response.json();

      if (data.status === false) {
        setAadhaarError(data.msg || 'No results found for this Aadhaar number. Please check the number and try again.');
        setAadhaarDetails(null);
      } else {
        const aadhaarData = data.data || data;

        if (aadhaarData && aadhaarData.address) {
          let members = [];
          if (Array.isArray(aadhaarData.memberDetailsList)) {
            members = aadhaarData.memberDetailsList.map((apiMember: any) => ({
              memName: apiMember.memberName,
              relation: apiMember.releationship_name,
            }));
          } else if (Array.isArray(aadhaarData.members)) {
            members = aadhaarData.members;
          }

          const finalDetails = {
            ...aadhaarData,
            members: members,
          };
          setAadhaarDetails(finalDetails);
          const updatedSearches = addRecentSearch('recentAadhaars', searchNumber);
          setRecentAadhaars(updatedSearches);
        } else {
          setAadhaarError('Please try again after few time.');
          setAadhaarDetails(null);
        }
      }
    } catch (err) {
      console.error(err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setAadhaarError('Please check your internet connection and try again.');
      } else if (err instanceof SyntaxError) {
        setAadhaarError('It might be temporarily unavailable.');
      } else if (err instanceof Error) {
        setAadhaarError(err.message);
      } else {
        setAadhaarError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsAadhaarLoading(false);
    }
  }, []);

  const handleNumberSearch = useCallback(async (searchNumber: string) => {
    if (searchNumber.length !== 10 || !/^\d+$/.test(searchNumber)) {
      setNumberError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsNumberLoading(true);
    setNumberError(null);
    setNumberDetails(null);

    try {
      const protectedNumbers = await fetchProtectedNumbers();
      if (protectedNumbers.includes(searchNumber)) {
        setNumberError('This phone number is protected and cannot be searched.');
        return;
      }
      
      const targetUrl = `https://truecaller-api.vercel.app/search?phone=${searchNumber}`;
      const response = await fetch(targetUrl);

      if (!response.ok) {
        throw new Error(`The server responded with an error (Status: ${response.status})`);
      }

      const data = await response.json();

      if (data.status !== 'success' || !data.data || !data.data.name) {
        setNumberError('No details found for this number.');
        setNumberDetails(null);
      } else {
        const rawDetails = data.data;
        const formattedDetails: NumberDetails = {
          mobile: rawDetails.phone?.international || searchNumber,
          name: rawDetails.name || '-',
          father: '-',
          address: rawDetails.address?.city || '-',
          altMobile: '-',
          circleIsp: rawDetails.carrier || '-',
          aadhar: '-',
          email: rawDetails.email || '-',
        };
        setNumberDetails(formattedDetails);
        const updatedSearches = addRecentSearch('recentNumbers', searchNumber);
        setRecentNumbers(updatedSearches);
      }
    } catch (err) {
      console.error(err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setNumberError(' Please check your internet connection and try again.');
      } else if (err instanceof SyntaxError) {
        setNumberError(' It might be temporarily unavailable.');
      } else if (err instanceof Error) {
        setNumberError(err.message);
      } else {
        setNumberError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsNumberLoading(false);
    }
  }, []);
  
  const handleRecentAadhaarClick = (query: string) => {
    setAadhaarNumber(query);
    handleAadhaarSearch(query);
  };

  const handleRecentNumberClick = (query: string) => {
    setPhoneNumber(query);
    handleNumberSearch(query);
  };
  
  const resetAndGoHome = () => {
    setView('home');
    setAadhaarNumber('');
    setAadhaarDetails(null);
    setAadhaarError(null);
    setPhoneNumber('');
    setNumberDetails(null);
    setNumberError(null);
  };
  
  const renderContent = () => {
    switch (view) {
      case 'aadhaar':
        return (
          <>
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
              onSearch={() => handleAadhaarSearch(aadhaarNumber)}
              isLoading={isAadhaarLoading}
            />
             <RecentSearches
              title="Recent Searches"
              searches={recentAadhaars}
              onSearch={handleRecentAadhaarClick}
            />
            <div className="w-full mt-8">
              {isAadhaarLoading && <Loader />}
              {aadhaarError && !isAadhaarLoading && (
                <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl animate-fade-in">
                  <p className="font-medium text-red-400">{aadhaarError}</p>
                </div>
              )}
              {aadhaarDetails && !isAadhaarLoading && <ResultsCard details={aadhaarDetails} />}
            </div>
          </>
        );
      case 'number':
        return (
           <>
            <header className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
                Number Info Finder
              </h1>
              <p className="mt-3 text-lg text-slate-400">
                Get details associated with any mobile number.
              </p>
            </header>
            <NumberSearchCard
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSearch={() => handleNumberSearch(phoneNumber)}
              isLoading={isNumberLoading}
            />
             <RecentSearches
              title="Recent Searches"
              searches={recentNumbers}
              onSearch={handleRecentNumberClick}
            />
            <div className="w-full mt-8">
              {isNumberLoading && <Loader />}
              {numberError && !isNumberLoading && (
                <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl animate-fade-in">
                  <p className="font-medium text-red-400">{numberError}</p>
                </div>
              )}
              {numberDetails && !isNumberLoading && <NumberResultsCard details={numberDetails} />}
            </div>
          </>
        );
      case 'home':
      default:
        return (
          <>
            <header className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
                Info Finder
              </h1>
              <p className="mt-3 text-lg text-slate-400">
                Choose a service to get started.
              </p>
            </header>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => setView('aadhaar')}
                className="w-64 relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-px overflow-hidden group text-lg"
              >
                Aadhaar Details
                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 mix-blend-soft-light"></span>
              </button>
              <button
                onClick={() => setView('number')}
                className="w-64 relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-px overflow-hidden group text-lg"
              >
                Number Info
                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 mix-blend-soft-light"></span>
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-grid-slate-700/[0.05] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,white)]"></div>
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(50%_50%_at_50%_50%,transparent,black)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-tr from-indigo-600/40 to-purple-600/40 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      {view !== 'home' && (
        <div className="w-full max-w-2xl mx-auto z-10">
          <button onClick={resetAndGoHome} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Home
          </button>
        </div>
      )}

      <main className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center flex-grow z-10">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;