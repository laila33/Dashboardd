import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  Clock,
  Power,
  Wrench,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Workshop {
  id: string;
  name: string;
  code: string;
  phone: string;
  state: number;
  substitutionDate: string;
  endDate: string;
  totalCustomers: number;
}

export default function WorkshopsPage() {
  const navigate = useNavigate();

  // States للبيانات
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [overview, setOverview] = useState({
    totalWorkshops: 0,
    totalActiveWorkshops: 0,
    totalInactiveWorkshops: 0,
    totalUsers: 0,
  });

  // States للتحميل والخطأ
  const [loading, setLoading] = useState(true);
  const [corsError, setCorsError] = useState(false);

  // States للبحث والمودال
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "suspended"
  >("all");
  const [extendModal, setExtendModal] = useState<Workshop | null>(null);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // ملاحظة: الـ 307 Moved Temporarily في الـ Console تشير أن الـ API قد يحتاج https بدلاً من http
        const baseUrl = "https://api.qudra.online/api/Admin";
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        // طلب الإحصائيات
        const statsRes = await fetch(`${baseUrl}/OverviewCardsData`, {
          headers,
        });
        const statsJson = await statsRes.json();

        if (statsJson.success) {
          setOverview(statsJson.data);
        }

        // طلب قائمة الورش
        const listRes = await fetch(`${baseUrl}/WorkshopsManagement`, {
          headers,
        });
        const listJson = await listRes.json();
        setWorkshops(listJson.data || []);

        setCorsError(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setCorsError(true); // تفعيل حالة الخطأ لإظهار حل للمستخدم
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const filtered = workshops.filter((w) => {
    const matchSearch =
      w.name?.toLowerCase().includes(search.toLowerCase()) ||
      w.phone?.includes(search);

    // ربط الفلتر بحقل state القادم من السيرفر
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? w.state === 0 : w.state !== 0);

    return matchSearch && matchStatus;
  });
  const handleExtendSubscription = async () => {
    if (!extendModal || !newDate) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://api.qudra.online/api/Admin/AddTime",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: extendModal.id,
            newEndDate: newDate,
          }),
        },
      );

      if (response.ok) {
        // تحديث البيانات محلياً لتوفير وقت التحميل
        setWorkshops((prev) =>
          prev.map((w) =>
            w.id === extendModal.id ? { ...w, endDate: newDate } : w,
          ),
        );
        setExtendModal(null);
        setNewDate("");
        // يمكنك إضافة Toast هنا للنجاح
      }
    } catch (error) {
      console.error("Error extending subscription:", error);
    }
  };
  const handleToggleStatus = async (workshop: Workshop) => {
  try {
    const token = localStorage.getItem("token");
    
    // جربي هذا المسار، في الغالب الـ ID يُرسل كـ Query Parameter
    // وإذا لم يعمل، جربي حذف "?id=" وإضافته للـ Body
    const response = await fetch(
      `https://api.qudra.online/api/Admin/ToggleWorkshopStatus?id=${workshop.id}`, 
      {
        method: "POST", 
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      // تحديث الواجهة فوراً بناءً على حقل state الرقمي
      setWorkshops((prev) =>
        prev.map((w) =>
          w.id === workshop.id
            ? { ...w, state: w.state === 0 ? 1 : 0 } 
            : w
        )
      );
      console.log("تم تغيير الحالة بنجاح");
    } else {
      console.error("فشل السيرفر في معالجة الطلب:", result.message);
    }
  } catch (error) {
    console.error("خطأ تقني في الاتصال:", error);
  }
};
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <TopHeader title="إدارة الورش" />

      <div className="p-6 space-y-6">
        {/* رسالة تنبيه في حال وجود مشكلة CORS */}
        {corsError && (
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">
              خطأ في الاتصال بالسيرفر (CORS). تأكدي من تفعيل الإضافة في المتصفح
              أو اطلبي من مطور الـ Back-end تفعيل Localhost.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4  gap-4">
          <StatCard
            title="إجمالي المستخدمين"
            value={loading ? "..." : overview.totalUsers}
            icon={<Users className="h-5 w-5" />}
            variant="default"
          />
          <StatCard
            title="إجمالي الورش"
            value={loading ? "..." : overview.totalWorkshops}
            icon={<Wrench className="h-5 w-5" />}
          />
          <StatCard
            title="الورش النشطة"
            value={loading ? "..." : overview.totalActiveWorkshops}
            icon={<CheckCircle className="h-5 w-5" />}
            variant="success"
          />
          <StatCard
            title="الورش المعلّقة"
            value={loading ? "..." : overview.totalInactiveWorkshops}
            icon={<XCircle className="h-5 w-5" />}
            variant="destructive"
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الهاتف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 bg-card"
              />
            </div>
            {/* <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 pr-10 pl-4 rounded-lg border border-input bg-card text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="suspended">معلّق</option>
            </select> */}
          </div>
          <Button
            onClick={() => navigate("/workshops/add")}
            className="gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" /> إضافة ورشة جديدة
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 flex justify-center">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : (
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4">اسم الورشة</th>
                    <th className="py-3 px-4">رقم الهاتف</th>
                    <th className="py-3 px-4">تاريخ الانتهاء</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((w) => (
                      <tr
                        key={w.id}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        {/* اسم الورشة مع الكود الخاص بها */}
                        <td className="py-3 px-4 font-semibold">
                          <div>
                            {w.name}
                            <div className="text-[10px] text-muted-foreground font-normal">
                              كود: {w.code}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono" dir="ltr">
                          {w.phone}
                        </td>
                        {/* تحويل التاريخ endDate لشكل مقروء */}
                        <td className="py-3 px-4">
                          {new Date(w.endDate).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-xs font-medium",
                              w.state === 0 // الاعتماد على حقل state من السيرفر
                                ? "bg-success/10 text-success"
                                : "bg-destructive/10 text-destructive",
                            )}
                          >
                            {w.state === 0 ? "نشط" : "معلّق"}
                          </span>
                        </td>
                        <td className="py-3 px-4 flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExtendModal(w)}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(w)} // ربط الدالة هنا عند الضغط
                            className={
                              w.state === 0
                                ? "text-destructive" // يظهر باللون الأحمر لو كانت الورشة نشطة (لتعطيلها)
                                : "text-success" // يظهر باللون الأخضر لو كانت معلقة (لتفعيلها)
                            }
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-muted-foreground"
                      >
                        لا توجد بيانات متاحة حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal تمديد الاشتراك */}
      <Dialog open={!!extendModal} onOpenChange={() => setExtendModal(null)}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تمديد اشتراك {extendModal?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm mb-2 block">التاريخ الجديد</label>
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setExtendModal(null)}>
              إلغاء
            </Button>
            <Button onClick={handleExtendSubscription}>حفظ</Button>{" "}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
