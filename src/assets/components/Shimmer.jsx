const Shimmer = ({ height ,width ,rounded , mdheight , lgHeight ,smWidth, mdWidth, lgWidth}) => {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 rounded-${rounded} ${width} sm:${smWidth} md:${mdWidth} lg:${lgWidth}  ${height}  md:${mdheight} lg:${lgHeight}`}
      
    >
      <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
};

export default Shimmer;
