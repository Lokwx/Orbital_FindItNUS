import { MenuItem, Select, FormControl, InputLabel, Switch } from '@mui/material';
import { RefreshCcw, SearchCheck, SearchX } from 'lucide-react';

export default function FilterPanel() {
    return (
        <section className="w-70 flex-1 bg-white border-r border-slate-400/50 flex flex-col">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold p-4">Filters</h1>
                <button
                    type="button"
                    className="p-4 flex flex-row gap-2 text-sm items-center justify-between"
                >
                    <RefreshCcw size={16} />
                    Refresh All
                </button>
            </div>
            <div className="flex flex-col gap-2">
                <p className="mx-4 font-bold text-md">Listing Type</p>
                <div className="flex flex-row mx-2 items-center justify-center">
                    <button
                        type="button"
                        className="flex flex-1 flex-row items-center gap-4 px-4 py-4 rounded-2xl
                    hover:bg-indigo-500/12 hover:border-slate-200 hover:border hover:text-indigo-600"
                    >
                        <SearchCheck />
                        Found
                    </button>
                    <button
                        type="button"
                        className="flex flex-1 flex-row items-center gap-4 px-4 py-4 rounded-2xl
                    hover:bg-indigo-500/12 hover:border-slate-200 hover:border hover:text-indigo-600"
                    >
                        <SearchX />
                        Lost
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-center font-bold text-md">Category</p>
                    <FormControl
                        fullWidth
                        size="small"
                    >
                        <InputLabel>Category</InputLabel>
                        <Select
                            label="Category"
                            // #TODO onChange={handleItemFilters}
                        >
                            <MenuItem value={1}>Electronics</MenuItem>
                            <MenuItem value={2}>Clothing</MenuItem>
                            <MenuItem value={3}>Furniture</MenuItem>
                            <MenuItem value={5}>Documents</MenuItem>
                            <MenuItem value={6}>Other</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-center font-bold text-md">Location</p>
                    <FormControl
                        fullWidth
                        size="small"
                    >
                        <InputLabel>Location</InputLabel>
                        <Select
                            label="Category"
                            // #TODO onChange={handleLocationFilters}
                        >
                            <MenuItem value={1}>Central Library</MenuItem>
                            <MenuItem value={2}>University Town</MenuItem>
                            <MenuItem value={3}>School of Computing</MenuItem>
                            <MenuItem value={4}>Faculty of Science</MenuItem>
                            <MenuItem value={5}>Faculty of Engineering</MenuItem>
                            <MenuItem value={6}>Business School</MenuItem>
                            <MenuItem value={7}>Faculty of Arts and Social Sciences</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-center font-bold text-md">Date</p>
                    <FormControl
                        fullWidth
                        size="small"
                    >
                        <InputLabel>Date</InputLabel>
                        <Select
                            label="Category"
                            // #TODO onChange={handleDateFilters}
                        >
                            <MenuItem value={1}>Today</MenuItem>
                            <MenuItem value={2}>Yesterday</MenuItem>
                            <MenuItem value={3}>Last 7 days</MenuItem>
                            <MenuItem value={4}>Last 14 days</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="flex flex-col mt-4 gap-2">
                <h1 className="text-center font-bold text-md">Category</h1>
                <div className="flex flex-col m-2">
                    <div className="flex flex-row gap-2 items-center justify-between text-nowrap">
                        <div>
                            <p className="font-bold">Has Photos</p>
                            <h1>Show items with images only</h1>
                        </div>
                        <Switch />
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center my-2'>
                {/* #TODO fix the submit now button */}
                <button type='button' className="flex items-center justify-center w-[260px] h-10 bg-indigo-400/50 rounded-2xl font-bold">Submit Now</button>
            </div>
        </section>
    );
}
