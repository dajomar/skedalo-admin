
import Calendar from '@/components/UI/Calendar';
import { useTranslation } from 'react-i18next'

import { Link } from 'react-router-dom';


export default function DashBoard() {
    const { t } = useTranslation()


    return (
        <>
            
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Appointments</p>
                            <p className="text-3xl font-bold text-gray-800">1,250</p>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-full">
                            <span className="material-symbols-outlined text-primary">event_available</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending Requests</p>
                            <p className="text-3xl font-bold text-gray-800">12</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <span className="material-symbols-outlined text-yellow-500">pending_actions</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">New Clients</p>
                            <p className="text-3xl font-bold text-gray-800">35</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <span className="material-symbols-outlined text-green-500">person_add</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="text-3xl font-bold text-gray-800">$5,430</p>
                        </div>
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <span className="material-symbols-outlined text-indigo-500">payments</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* calendar */}

                    <Calendar />
                    {/* <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Calendar</h3>
                            <div className="flex items-center space-x-2">
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                    <span className="material-symbols-outlined text-gray-600">chevron_left</span>
                                </button>
                                <span className="font-semibold text-gray-700">October 2023</span>
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                    <span className="material-symbols-outlined text-gray-600">chevron_right</span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            <div className="text-gray-400 p-2 text-center">29</div>
                            <div className="text-gray-400 p-2 text-center">30</div>
                            <div className="p-2 text-center text-gray-800">1</div>
                            <div className="p-2 text-center text-gray-800 relative">2<span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-red-500 rounded-full"></span>
                            </div>
                            <div className="p-2 text-center text-gray-800">3</div>
                            <div className="p-2 text-center text-gray-800">4</div>
                            <div className="p-2 text-center text-gray-800 relative">5<span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>
                            </div>
                            <div className="p-2 text-center text-gray-800">6</div>
                            <div className="p-2 text-center text-gray-800">7</div>
                            <div className="p-2 text-center text-gray-800">8</div>
                            <div className="p-2 text-center text-gray-800">9</div>
                            <div className="p-2 text-center text-gray-800 relative">10<span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>
                            </div>
                            <div className="p-2 text-center text-gray-800 bg-primary text-white rounded-full">11</div>
                            <div className="p-2 text-center text-gray-800">12</div>
                            <div className="p-2 text-center text-gray-800">13</div>
                            <div className="p-2 text-center text-gray-800 relative">14<span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-green-500 rounded-full"></span>
                            </div>
                            <div className="p-2 text-center text-gray-800">15</div>
                            <div className="p-2 text-center text-gray-800">16</div>
                            <div className="p-2 text-center text-gray-800">17</div>
                            <div className="p-2 text-center text-gray-800">18</div>
                            <div className="p-2 text-center text-gray-800">19</div>
                            <div className="p-2 text-center text-gray-800">20</div>
                            <div className="p-2 text-center text-gray-800">21</div>
                            <div className="p-2 text-center text-gray-800">22</div>
                            <div className="p-2 text-center text-gray-800 relative">23<span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>
                            </div>
                            <div className="p-2 text-center text-gray-800">24</div>
                            <div className="p-2 text-center text-gray-800">25</div>
                            <div className="p-2 text-center text-gray-800">26</div>
                            <div className="p-2 text-center text-gray-800">27</div>
                            <div className="p-2 text-center text-gray-800">28</div>
                            <div className="p-2 text-center text-gray-800">29</div>
                            <div className="p-2 text-center text-gray-800">30</div>
                            <div className="p-2 text-center text-gray-800">31</div>
                            <div className="text-gray-400 p-2 text-center">1</div>
                            <div className="text-gray-400 p-2 text-center">2</div>
                        </div>
                    </div> */}




                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                <img alt="Client avatar" className="h-12 w-12 rounded-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDklRPaWNVnJ1Vs75-C8yr7YOhBQAvtFL3LwPj01vRoJit4sfGrHhuKCAt40hxYH4o4ODLHf4dAUqL_H0yYHC135nDzCx1-d_fTpEpjAIVtDyMbqo4ZYv3irB2qM49qwE3LicHsiK1qOl7l9SPfHUMkA-JjFylmLo-fCXKskaPuApO4r32P21VoX9LB4UVtgex8V6ZAWgvYvBSHudcLm85Sxt7iOqSH2lisJ1pXwbLvcjea0XqxhxH29S1bVRT-FVoZqw8pUmJAq50" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">Olivia Smith</p>
                                    <p className="text-sm text-gray-500">Haircut &amp; Styling</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-primary">10:30 AM</p>
                                    <p className="text-xs text-gray-500">Today</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                <img alt="Client avatar" className="h-12 w-12 rounded-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1RkAge293duXI9jxi3K4FDfNxqU5EK3-x72Oy2LYczpsh7qIwh_0SiHrwTrHBr6pGIA5pnOIwfrDk-DWYQzyKXavX3AAFU9CFEsqZFIp2hYvANlm5i0_1_T9mbDQy3eTVOpGcDSvcPNZsENYCZ4B65D3aXNRBnb9yWGkpJutgMxOU7hegPHD3uQJ0CWaJ8Og_1khO381PTJa0zy9gQilL1BIS9EpsR3B5qnkS-6snrk6FJQg4Usu3PYW4TghB-oRQvRwgkywVtuE" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">Ethan Jones</p>
                                    <p className="text-sm text-gray-500">Manicure</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-700">02:00 PM</p>
                                    <p className="text-xs text-gray-500">Today</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                <img alt="Client avatar" className="h-12 w-12 rounded-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhtQ3gCwSYD52fgWrpsLOcMpykKB05-lUA8VYXIGdMvguU5bZaHtDC8-hwS0JctzqCZ-sVRP34tTno-cm5rkJR1BPf3zgr6tAxpszSPef9cFxcTa2VRtPuKNNzhS3dol0noTYQm7ARBm7E1i9-J7nkvxA_WpFm7oq_mzyNuNqr1y08RYp6w60QFWE7MwRFN9WQtbwWdPm55zWTS-1f-23Y7V18aRlbXOs5G7vKbDNPnogqlPpI0E7IAkXs7NalKqkWU-n1cbiQOHE" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">Sophia Williams</p>
                                    <p className="text-sm text-gray-500">Facial Treatment</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-700">04:30 PM</p>
                                    <p className="text-xs text-gray-500">Today</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                <img alt="Client avatar" className="h-12 w-12 rounded-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWsczghtJDIeRvRNUWUUo48qbIaS4Ndr5K3DWyPcldGRuP4UchtEdOpNRXJVPLboLkyBxmKYG1eevLXDdkQODGcUgAqKTxUALeXRAOcL6dQHPEDwmzJeFkt5L9UPzQMGCdMatfvKAuQBbR9oLwbyRvUs52PC9aR4yU4ima887xmLCuY5whLsu_eF8bUC9wrn-GYSfrohkH8NNExTYVGaEotE5Ii9amoVV2gN0g3I7yNyijoTzqPbRAJCxyIJFNqWryLCQQe9vFGYU" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">Liam Brown</p>
                                    <p className="text-sm text-gray-500">Deep Tissue Massage</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-700">09:00 AM</p>
                                    <p className="text-xs text-gray-500">Tomorrow</p>
                                </div>
                            </div>
                        </div>
                        <button className="mt-4 w-full text-primary font-semibold py-2 rounded-lg hover:bg-primary/5">View
                            all appointments</button>
                    </div>
                </div>
            </div>
       
        </>
    )


}
