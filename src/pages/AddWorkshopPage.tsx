import { useNavigate } from "react-router-dom";
import { TopHeader } from "@/components/TopHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddWorkshopPage() {
  const navigate = useNavigate();

  return (
    <>
      <TopHeader title="إضافة ورشة جديدة" />
      <div className="flex-1 flex items-start justify-center p-6 pt-12">
        <div className="w-full max-w-lg bg-card rounded-xl border border-border p-8 animate-fade-in">
          <h3 className="text-xl font-bold text-foreground mb-6">إضافة ورشة عمل جديدة</h3>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">اسم الورشة</label>
              <Input placeholder="مثال: ورشة الأمان للسيارات" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">رقم هاتف المالك</label>
              <Input placeholder="05XXXXXXXX" dir="ltr" className="text-right" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">كلمة المرور</label>
              <Input type="password" placeholder="أدخل كلمة مرور للورشة" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">تاريخ انتهاء الاشتراك</label>
              <Input type="date" />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button className="flex-1">حفظ الورشة</Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate("/workshops")}>
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
