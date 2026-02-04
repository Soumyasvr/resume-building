import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { dummyResumeData } from '../assets/assets';
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, FileText, FolderIcon, GraduationCap, Sparkle, User } from 'lucide-react';
import PersonalInfoForm from '../components/PersonalInfoForm';

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

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    {id: "personal", name: "Personal Info", icon: User},
    {id: "summary", name: "Summary", icon: FileText},
    {id: "experience", name: "Experience", icon: Briefcase},
    {id: "education", name: "Education", icon: GraduationCap},
    {id: "skills", name: "Skills", icon: Sparkle},
    {id: "projects", name: "Projects", icon: FolderIcon},
  ]

  const activeSection = sections[activeSectionIndex];

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
      <div  className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* left panel -forms */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/* progress bar using activeSectionIndex */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200'/>
              <hr style={{width:`${activeSectionIndex*100 / (sections.length -1)}%`}} className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to green-600 border-none transition-all duration-2000'/>
              
              {/* Section Naviagtion */}
                <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                  <div></div>
                  <div className='flex items-center'>
                    {activeSectionIndex !== 0 &&(
                      <button className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 
                      transaition-all' disabled={activeSectionIndex === 0} onClick={() => setActiveSectionIndex((prev) => Math.max(prev -1, 0))}>
                        <ChevronLeft className='size-4'/> Previous
                      </button>
                    )}

                    <button className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 
                      hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={activeSectionIndex === sections.length - 1} onClick={() => setActiveSectionIndex((prev) => Math.min(prev + 1, sections.length - 1))}>
                        Next <ChevronRight className='size-4'/>
                      </button>

                  </div>

                </div>
                {/* Form content */}
                <div className='space-y-6'>
                  {activeSection.id === "personal" && (
                    <PersonalInfoForm 
                    data={resumeData.personal_info} 
                    onChange={(data) => setResumeData(prev => ({...prev, personal_info: data}))} 
                    removeBackground={removeBackground} 
                    setRemoveBackground={setRemoveBackground}/>
                  )}

                </div>
            </div>
          </div>
          {/* Right panel - preview */}
          <div>


        </div>
      </div>

    </div>
    </div>
  )
}

export default ResumeBuilder
