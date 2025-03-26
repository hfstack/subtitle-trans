"use client";

import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  label?: string;
  theme?: 'light' | 'dark';
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileChange, 
  accept = ".txt,.srt,.vtt", 
  label = "上传文件",
  theme = 'light'
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 根据主题设置样式
  const getThemeClasses = () => {
    if (theme === 'dark') {
      return {
        border: isDragging ? 'border-blue-300 bg-blue-900/20' : 'border-gray-500 hover:border-blue-300',
        text: 'text-white',
        subtext: 'text-gray-300',
        icon: 'text-gray-300',
        filename: 'text-blue-300'
      };
    }
    
    return {
      border: isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400',
      text: 'text-gray-600',
      subtext: 'text-gray-500',
      icon: 'text-gray-400',
      filename: 'text-blue-600'
    };
  };
  
  const themeClasses = getThemeClasses();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName(null);
      onFileChange(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // 检查文件类型是否符合accept属性
      const acceptTypes = accept.split(',');
      const fileType = `.${file.name.split('.').pop()}`;
      
      if (acceptTypes.includes(fileType) || acceptTypes.includes('*')) {
        setFileName(file.name);
        onFileChange(file);
        
        // 更新文件输入框的值
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }
      } else {
        alert(`请上传${accept}格式的文件`);
      }
    }
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${themeClasses.border}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
        ref={fileInputRef}
      />
      
      {fileName ? (
        <div>
          <p className={`text-sm ${themeClasses.subtext} mb-1`}>已选择文件:</p>
          <p className={`font-medium ${themeClasses.filename}`}>{fileName}</p>
          <p className={`text-xs text-gray-400 mt-2`}>点击或拖拽更换文件</p>
        </div>
      ) : (
        <div>
          <svg
            className={`mx-auto h-12 w-12 ${themeClasses.icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className={`mt-2 text-sm ${themeClasses.text}`}>{label}</p>
          <p className={`mt-1 text-xs ${themeClasses.subtext}`}>
            支持格式: {accept.replace(/\./g, '').toUpperCase()}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 