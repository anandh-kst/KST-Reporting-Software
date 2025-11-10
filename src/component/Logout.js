import { useNavigate } from 'react-router-dom';

const logOuts = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Do you want to logout from the KST Reporting Software Website?");
        if (confirmLogout) {
            navigate('/'); // Redirect to login page
        }
    };

    return (
        <li>
            <div onClick={handleLogout} className="flex cursor-pointer items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                </svg>
                <span className="flex-1 text-left ml-3 ms-3 select-none whitespace-nowrap">Logout</span>
            </div>
        </li>
    );
};

export default logOuts;
