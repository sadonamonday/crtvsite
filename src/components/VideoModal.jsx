import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './VideoModal.css';

const VideoModal = ({ video, onClose }) => {
  const iframeRef = useRef(null);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Load Instagram embed script when modal opens with a reel
  useEffect(() => {
    if (video?.type === 'reel') {
      // Check if Instagram script is already loaded
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      } else {
        // Load Instagram embed script
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        };
        document.body.appendChild(script);
      }
    }
  }, [video]);

  if (!video) return null;

  const isReel = video.type === 'reel';

  return (
    <motion.div 
      className="video-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="video-modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="close-button" 
          onClick={onClose}
          aria-label="Close video"
        >
          ×
        </button>
        
        {isReel ? (
          // Instagram Reel Embed Section
          <div className="instagram-reel-container">
            <div className="instagram-embed-wrapper">
              <blockquote 
                className="instagram-media"
                data-instgrm-permalink={video.url}
                data-instgrm-version="14"
                style={{
                  background: '#FFF', 
                  border: '0',
                  borderRadius: '3px',
                  boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                  margin: '1px',
                  maxWidth: '540px',
                  minWidth: '326px',
                  padding: '0',
                  width: '99.375%',
                  width: '-webkit-calc(100% - 2px)',
                  width: 'calc(100% - 2px)'
                }}
              >
                <div style={{ padding: '16px' }}>
                  <a 
                    href={video.url} 
                    style={{
                      background: '#FFFFFF', 
                      lineHeight: 0,
                      padding: '0 0',
                      textAlign: 'center',
                      textDecoration: 'none',
                      width: '100%'
                    }} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <div style={{
                        backgroundColor: '#F4F4F4',
                        borderRadius: '50%',
                        flexGrow: 0,
                        height: '40px',
                        marginRight: '14px',
                        width: '40px'
                      }}></div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          backgroundColor: '#F4F4F4',
                          borderRadius: '4px',
                          flexGrow: 0,
                          height: '14px',
                          marginBottom: '6px',
                          width: '100px'
                        }}></div>
                        <div style={{
                          backgroundColor: '#F4F4F4',
                          borderRadius: '4px',
                          flexGrow: 0,
                          height: '14px',
                          width: '60px'
                        }}></div>
                      </div>
                    </div>
                    <div style={{ padding: '19% 0' }}></div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: '14px',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        backgroundColor: '#F4F4F4',
                        borderRadius: '50%',
                        height: '20px',
                        marginLeft: '2px',
                        marginRight: '4px',
                        width: '20px'
                      }}></div>
                      <div style={{
                        backgroundColor: '#F4F4F4',
                        borderRadius: '4px',
                        flexGrow: 0,
                        height: '16px',
                        width: '120px'
                      }}></div>
                    </div>
                  </a>
                  <p style={{
                    color: '#c9c8cd',
                    fontFamily: 'Arial,sans-serif',
                    fontSize: '14px',
                    lineHeight: '17px',
                    marginBottom: '0',
                    marginTop: '8px',
                    overflow: 'hidden',
                    padding: '8px 0 7px',
                    textAlign: 'center',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    <a 
                      href={video.url} 
                      style={{
                        color: '#c9c8cd',
                        fontFamily: 'Arial,sans-serif',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        lineHeight: '17px'
                      }} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View this Reel on Instagram
                    </a>
                  </p>
                </div>
              </blockquote>
            </div>
            
            {/* Fallback option */}
            <div className="instagram-fallback">
              <p>Having trouble loading the reel?</p>
              <button 
                className="instagram-button"
                onClick={() => window.open(video.url, '_blank', 'noopener,noreferrer')}
              >
                Open Reel on Instagram
              </button>
            </div>
          </div>
        ) : (
          // YouTube Video Section
          <div className="youtube-video-container">
            <div className="video-wrapper">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                title={video.caption}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
        
        <div className="video-modal-info">
          <h4>{video.caption}</h4>
          <div className="video-meta">
            <span className={`video-platform ${isReel ? 'instagram' : 'youtube'}`}>
              {isReel ? 'Instagram Reel' : 'YouTube Video'}
            </span>
            {video.duration && (
              <span className="video-duration">• {video.duration}</span>
            )}
            {video.category && (
              <span className="video-category-tag">• {video.category.toUpperCase()}</span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoModal;