"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// import { Trash2, Plus, Search } from "react-icons/fi";
import { Textarea } from "@/components/ui/textarea";
import { AiOutlineDelete } from "react-icons/ai";
import { CircleFadingPlus, Search } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      question: "How do I assign orders?",
      answer: "Go to the Orders tab and click Assign.",
    },
    {
      id: 2,
      question: "How do I deactivate an agent?",
      answer: "Go to Agents, click on Edit, then change status.",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleAddFaq = () => {
    if (newQuestion && newAnswer) {
      setFaqs([
        ...faqs,
        {
          id: Date.now(),
          question: newQuestion,
          answer: newAnswer,
        },
      ]);
      setNewQuestion("");
      setNewAnswer("");
      setOpen(false);
    }
  };

  const handleDelete = (id: number) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container p-3">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/2">
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-[#9D215D]"
          />
          <Search className="absolute top-2 left-2 size-5 text-[#9D215D]" />
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-[#9D215D] hover:bg-[#9D215D] text-white flex items-center gap-2 mr-2"
        >
          <CircleFadingPlus size={16} />
        </Button>
      </div>

      <div className="space-y-6 mx-1">
        {filteredFaqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-[#9D215D]">
                  {faq.question}
                </h4>
                <p className="text-gray-600 mt-1">{faq.answer}</p>
              </div>
              <button
                onClick={() => handleDelete(faq.id)}
                className="text-red-500 hover:text-red-600"
              >
                <AiOutlineDelete size={20} />
              </button>
            </div>
          </div>
        ))}
        {filteredFaqs.length === 0 && (
          <p className="text-center text-gray-500">No FAQs found.</p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#9D215D]">Add New FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <Textarea
              placeholder="Enter the answer"
              rows={4}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddFaq}
              className="bg-[#9D215D] text-white hover:bg-[#9D215D]"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
