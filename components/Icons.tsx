import React from 'react';

const Icon: React.FC<{ children: React.ReactNode; className?: string, viewBox?: string }> = ({ children, className = "w-6 h-6", viewBox="0 0 24 24" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox={viewBox} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        {children}
    </svg>
);

export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path clipRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.615 2.873c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" fillRule="evenodd"/>
  </svg>
);

export const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M20.25 10.5c0 6-8.25 12-8.25 12S3.75 16.5 3.75 10.5a8.25 8.25 0 1116.5 0z" /><path d="M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /></Icon>
);

export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></Icon>
);

export const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.04.357.087.53.133m0 0c.294.096.612.224.954.382m0 0a2.249 2.249 0 012.13-1.916 2.249 2.249 0 012.13 1.916m-4.26 0a2.249 2.249 0 002.13 1.916 2.249 2.249 0 002.13-1.916m0 0a2.25 2.25 0 100-2.186m0 2.186c-.18-.04-.357-.087-.53-.133m0 0c-.294-.096-.612-.224-.954-.382m0 0a2.248 2.248 0 00-2.13-1.916 2.248 2.248 0 00-2.13 1.916m4.26 0a2.248 2.248 0 01-2.13-1.916 2.248 2.248 0 01-2.13 1.916m0 0a2.25 2.25 0 100 2.186m0-2.186c.18.04.357.087.53.133" /></Icon>
);

export const WifiOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M15.58 14.37a5.25 5.25 0 00-6.16-6.16l-4.02 4.02a5.25 5.25 0 006.16 6.16l4.02-4.02z" /><path d="M19.78 16.52A9 9 0 007.48 4.22M12 18a6 6 0 006-6" /><path d="M3 3l18 18" /></Icon>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></Icon>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M6 18L18 6M6 6l12 12" /></Icon>
);

export const WhatsappIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M12 4.5v15m7.5-7.5h-15" /></Icon>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></Icon>
);

export const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.548 0c-.975c-.217-1.493-1.135-2.64-2.226-2.873s-2.14.22-2.873 1.135c-.732.915-.849 2.108-.286 3.08s1.635 1.85 2.916 1.85h8.932c1.28 0 2.45-.88 2.916-1.85.563-.972.446-2.165-.286-3.08-.732-.915-1.782-1.4-2.873-1.135s-1.93.13-2.226 2.873m0 0l-1.473 10.312" /></Icon>
);

export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></Icon>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon>
);

export const LoginIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-6l-3 3m0 0l3 3m-3-3h12.75" /></Icon>
);

export const KebabMenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></Icon>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></Icon>
);

export const BookmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}><path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon>
);

export const ChatBubbleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}><path d="M20.25 8.511c.068.44.108.9.108 1.365 0 3.844-4.34 6.954-9.684 6.954-1.227 0-2.403-.136-3.508-.386-1.423-.424-2.735-1.09-3.794-1.992a.75.75 0 01.246-1.285 6.74 6.74 0 00.573-.559 6.74 6.74 0 00.34-1.073 2.549 2.549 0 01-.133-1.026V8.511c0-3.132 3.65-5.673 8.182-5.673 4.532 0 8.182 2.54 8.182 5.673z" /></Icon>
);