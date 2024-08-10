// import React from 'react';
// import { ReviewPrint3d } from '../../../lib/reviewPrint3dApi';
// import Image from 'next/image';

// interface ReviewPrint3dListProps {
//   reviews: ReviewPrint3d[];
//   onDelete: (id: number) => void;
// }

// const ReviewPrint3dList: React.FC<ReviewPrint3dListProps> = ({ reviews, onDelete }) => {
//   return (
//     <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
//       {reviews.map((review) => (
//         <li key={review.id} className="border rounded bg-gray-800 text-white p-4">
//           <div className="flex-grow">
//             <span className="block font-bold mb-2">
//               {review.title}
//             </span>
//             {review.description && (
//               <span className="block text-gray-400 mb-2">
//                 {review.description}
//               </span>
//             )}
//             {review.images && review.images.map((image) => (
//               <div key={image.id} className="w-full flex justify-center mb-2">
//                 <Image
//                   src={image.url}
//                   alt={`Review ${review.title}`}
//                   width={800}
//                   height={600}
//                   className="w-full h-auto rounded"
//                   priority={true}
//                 />
//               </div>
//             ))}
//             <span className="block text-gray-500 text-sm mt-1">
//               Создано: {new Date(review.createdAt).toLocaleString()}
//             </span>
//           </div>
//           <div className="flex justify-end mt-4">
//             <button
//               onClick={() => onDelete(review.id)}
//               className="bg-red-500 text-white p-2 rounded"
//             >
//               Delete
//             </button>
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default ReviewPrint3dList;
