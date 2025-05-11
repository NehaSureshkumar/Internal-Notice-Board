import { Card, CardContent } from "@/components/ui/card";
import { getRecentNotices, getActiveNoticesCount, getPopularKnowledgeItems, formatDate } from "@/lib/utils";
import { useAppContext } from "@/context/app-context";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { NoticeDetail } from "@/components/notices/notice-detail";
import { KnowledgeDetail } from "@/components/knowledge/knowledge-detail";

export default function Dashboard() {
  const { notices, knowledgeItems, categories, isLoading, setSelectedNotice, setSelectedKnowledgeItem } = useAppContext();

  const handleViewNotice = (noticeId: string) => {
    const notice = notices.find(n => n.id === noticeId);
    if (notice) {
      setSelectedNotice(notice);
    }
  };
  
  const handleViewKnowledgeItem = (itemId: string) => {
    const item = knowledgeItems.find(i => i.id === itemId);
    if (item) {
      setSelectedKnowledgeItem(item);
    }
  };
  
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const recentNotices = getRecentNotices(notices);
  const popularKnowledgeItems = getPopularKnowledgeItems(knowledgeItems);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome to your knowledge hub</p>
        </div>

        {/* Print-only header */}
        <div className="print-only">
          <h1 className="text-2xl font-bold text-black mb-2">Internal Knowledge Hub</h1>
          <p className="text-sm text-gray-600 mb-6">Printed on {new Date().toLocaleDateString()}</p>
          <hr className="mb-6" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary bg-opacity-10 rounded-md p-3">
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-secondary bg-opacity-10 rounded-md p-3">
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-accent bg-opacity-10 rounded-md p-3">
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary bg-opacity-10 rounded-md p-3">
                    <i className="ri-notification-3-line text-primary text-xl"></i>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Notices</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {getActiveNoticesCount(notices)}
                      </div>
                    </dd>
                  </div>
                </div>
              </CardContent>
              <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <Link href="/notices">
                    <a className="font-medium text-primary hover:text-primary-dark">View all</a>
                  </Link>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-secondary bg-opacity-10 rounded-md p-3">
                    <i className="ri-book-open-line text-secondary text-xl"></i>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Knowledge Articles</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {knowledgeItems.length}
                      </div>
                    </dd>
                  </div>
                </div>
              </CardContent>
              <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <Link href="/knowledge">
                    <a className="font-medium text-secondary hover:text-secondary-dark">View all</a>
                  </Link>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-accent bg-opacity-10 rounded-md p-3">
                    <i className="ri-folder-line text-accent text-xl"></i>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Categories</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {categories.length}
                      </div>
                    </dd>
                  </div>
                </div>
              </CardContent>
              <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <Link href="/knowledge">
                    <a className="font-medium text-accent hover:text-accent-dark">Manage</a>
                  </Link>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices */}
        <Card className="bg-white dark:bg-gray-800 shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Notices</h3>
            <Link href="/notices">
              <a className="text-sm text-primary hover:text-primary-dark">View all</a>
            </Link>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700">
            {isLoading ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="mt-2">
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentNotices.map((notice) => (
                  <li key={notice.id}>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); handleViewNotice(notice.id); }}
                      className="block hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary truncate">{notice.title}</p>
                            {notice.priority === 'high' && (
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                  High Priority
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(notice.date)}</p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <i className="ri-user-line flex-shrink-0 mr-1.5 text-gray-400 dark:text-gray-500"></i>
                              <span>{notice.author}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
                {recentNotices.length === 0 && (
                  <li className="px-4 py-4 sm:px-6 text-sm text-gray-500 dark:text-gray-400">
                    No recent notices
                  </li>
                )}
              </ul>
            )}
          </div>
        </Card>
        
        {/* Popular Knowledge */}
        <Card className="bg-white dark:bg-gray-800 shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Popular Knowledge</h3>
            <Link href="/knowledge">
              <a className="text-sm text-primary hover:text-primary-dark">View all</a>
            </Link>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700">
            {isLoading ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="mt-2">
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {popularKnowledgeItems.map((item) => (
                  <li key={item.id}>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); handleViewKnowledgeItem(item.id); }}
                      className="block hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-secondary truncate">{item.title}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Updated {formatDate(item.updated)}</p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <i className="ri-folder-line flex-shrink-0 mr-1.5 text-gray-400 dark:text-gray-500"></i>
                              <span>{getCategoryName(item.categoryId)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
                {popularKnowledgeItems.length === 0 && (
                  <li className="px-4 py-4 sm:px-6 text-sm text-gray-500 dark:text-gray-400">
                    No knowledge items available
                  </li>
                )}
              </ul>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <NoticeDetail />
      <KnowledgeDetail />
    </div>
  );
}
