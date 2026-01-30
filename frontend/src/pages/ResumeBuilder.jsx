import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { dummyResumeData } from '../assets/assets';
import { ArrowLeftIcon } from 'lucide-react';

const ResumeBuilder = () => {

  const {resumeId} = useParams();
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    template: "classic",
    accent_color: "#10b981",
    public: false,
  })

  const loadExistingResume = async (resumeId) => {
    // Fetch resume data from backend (not implemented)
    // setResumeData(fetchedData)
    const resume = dummyResumeData.find(resume => resume._id === resumeId);
    if(resume){
      setResumeData(resume);
      document.title = resume.title + " - Resume Builder";
    }
  }

  useEffect(() => {
    loadExistingResume()
  },[])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-6'>
       <Link to="/app" className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
        <ArrowLeftIcon className='size-4'/> Back to Dashboard
       </Link>
      </div>
    </div>
  )
}

export default ResumeBuilder
