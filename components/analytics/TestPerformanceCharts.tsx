"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, TrendingUp, TrendingDown, Minus, Target, Award, ListChecks } from "lucide-react";

export interface TestPerformanceData {
  trendData: { name: string; percentage: number; date: string }[];
  distributionData: { name: string; count: number; fill: string }[];
  comparisonData: { name: string; score: number; total: number }[];
  summary: {
    totalAttempted: number;
    totalAvailable: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    passRate: number;
    bestTestName: string;
    worstTestName: string;
    recentTrend: "Improving" | "Stable" | "Declining";
    textualAnalysis: string[];
  };
}

export function TestPerformanceCharts({ data }: { data: TestPerformanceData }) {
  const { trendData, distributionData, comparisonData, summary } = data;

  if (summary.totalAttempted === 0) {
    return (
      <div className="w-full p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
        <BrainCircuit size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">No Test Data Yet</h3>
        <p className="text-slate-500 font-medium mt-2">
          You haven't attempted any AI tests yet. Once you complete a test, your performance analytics will appear here.
        </p>
      </div>
    );
  }

  const TrendIcon =
    summary.recentTrend === "Improving" ? TrendingUp :
      summary.recentTrend === "Declining" ? TrendingDown : Minus;

  const trendColor =
    summary.recentTrend === "Improving" ? "text-emerald-500 bg-emerald-50 border-emerald-200" :
      summary.recentTrend === "Declining" ? "text-red-500 bg-red-50 border-red-200" :
        "text-amber-500 bg-amber-50 border-amber-200";

  return (
    <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <BrainCircuit className="text-indigo-600" size={32} strokeWidth={2.5} />
        <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">
          Test Performance
        </h2>
      </div>

      {/* Top Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tests Attempted</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">{summary.totalAttempted}</span>
            <span className="text-sm font-bold text-slate-400">/ {summary.totalAvailable}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Avg Score</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-indigo-600">{summary.averageScore}</span>
            <span className="text-sm font-bold text-indigo-400">%</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Highest Score</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-600">{summary.highestScore}</span>
            <span className="text-sm font-bold text-emerald-400">%</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pass Rate</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-amber-500">{summary.passRate}</span>
            <span className="text-sm font-bold text-amber-400">%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Trend & Comparison */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Chart */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-500" /> Score Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 900, color: '#4f46e5' }}
                      labelStyle={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#4f46e5"
                      strokeWidth={4}
                      dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Score (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Chart */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                <Target size={16} className="text-emerald-500" /> Score vs Total Marks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} iconType="circle" />
                    <Bar dataKey="score" name="Obtained" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="total" name="Total Marks" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Distribution & Textual Analysis */}
        <div className="space-y-6">

          {/* Performance Summary Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col gap-6">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black uppercase tracking-wider mb-4 ${trendColor}`}>
                <TrendIcon size={14} strokeWidth={3} />
                {summary.recentTrend}
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white mb-1">Performance Insight</h3>
              <p className="text-sm font-medium text-slate-400">AI-generated summary based on your test history.</p>
            </div>

            <div className="space-y-3">
              {summary.textualAnalysis.map((text, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shrink-0 mt-0.5 text-indigo-400">
                    <ListChecks size={16} strokeWidth={3} />
                  </div>
                  <p className="text-sm font-bold text-slate-200 leading-snug">{text}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700/50">
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-1"><Award size={10} /> Strongest</p>
                <p className="text-xs font-bold text-white line-clamp-2 leading-tight">{summary.bestTestName}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1"><Target size={10} /> Needs Work</p>
                <p className="text-xs font-bold text-white line-clamp-2 leading-tight">{summary.worstTestName}</p>
              </div>
            </div>
          </div>

          {/* Distribution Chart */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                <BarChart size={16} className="text-amber-500" /> Grade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 900 }}
                      axisLine={false}
                      tickLine={false}
                      width={60}
                    />
                    <Tooltip
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ display: 'none' }}
                      itemStyle={{ fontWeight: 900, fontSize: 12 }}
                    />
                    <Bar dataKey="count" name="Tests" radius={[0, 4, 4, 0]}>
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
