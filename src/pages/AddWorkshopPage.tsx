import { useNavigate } from "react-router-dom";
import { TopHeader } from "@/components/TopHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddWorkshopPage() {
  const navigate = useNavigate();

  return (
    <>
      <TopHeader title="إضافة ورشة جديدة" />
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-lg bg-card rounded-xl border border-border p-5 sm:p-8 animate-fade-in">
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-6 text-center sm:text-right">
            إضافة ورشة عمل جديدة
          </h3>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                اسم الورشة
              </label>
              <Input
                placeholder="مثال: ورشة الوطنية للسيارات"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                رقم هاتف المالك
              </label>
              <Input
                placeholder="XXXXXXXX"
                dir="ltr"
                className="text-right w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                كلمة المرور
              </label>
              <Input
                type="password"
                placeholder="أدخل كلمة مرور للورشة"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                تاريخ انتهاء الاشتراك
              </label>
              <Input type="date" className="w-full" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button className="w-full sm:flex-1">حفظ الورشة</Button>
            <Button
              variant="outline"
              className="w-full sm:flex-1"
              onClick={() => navigate("/workshops")}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}